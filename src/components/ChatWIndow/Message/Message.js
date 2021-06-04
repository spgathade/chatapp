/* eslint-disable consistent-return */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { Alert, Button } from 'rsuite';
import { auth, database, storage } from '../../../misc/firebase';
import { groupBy, TransformToArraywithID } from '../../../misc/Helper';
import MessageItem from './MessageItem';

const Pagesize = 15;
const MessageRef = database.ref('/messages');

function scrolltoBottom(node, threshold = 1) {
  const percentage =
    (100 * node.scrollTop) / (node.scrollHeight - node.clientHeight) || 0;

  return percentage > threshold;
}

const Messages = () => {
  const { chatId } = useParams();
  const [Message, setMessage] = useState(null);
  const [pageLimit, setpageLimit] = useState(Pagesize);

  const ChatEmpty = Message && Message.length === 0;
  const DisplayMessage = Message && Message.length > 0;
  const selfRef = useRef();

  const loadMessage = useCallback(
    limitToLast => {
      MessageRef.off();
      const node = selfRef.current;

      MessageRef.orderByChild('roomId')
        .equalTo(chatId)
        .limitToLast(limitToLast || Pagesize)
        .on('value', snap => {
          const Data = TransformToArraywithID(snap.val());

          setMessage(Data);
          if (scrolltoBottom(node)) {
            node.scrollTop = node.scrollHeight;
          }
        });

      setpageLimit(p => p + Pagesize);
    },
    [chatId]
  );

  useEffect(() => {
    const node = selfRef.current;

    loadMessage();

    setTimeout(() => {
      node.scrollTop = node.scrollHeight;
    }, 500);

    return () => {
      MessageRef.off('value');
    };
  }, [loadMessage]);

  const loadMore = useCallback(() => {
    const node = selfRef.current;
    const oldHeight = node.scrollHeight;

    loadMessage(pageLimit);

    setTimeout(() => {
      const newHeight = node.scrollHeight;
      node.scrollTop = newHeight - oldHeight;
    }, 500);
  }, [loadMessage, pageLimit]);

  const HandleAdmin = useCallback(
    async uid => {
      const AdminRef = database.ref(`/rooms/${chatId}/admin`);

      let AlertMsg;
      await AdminRef.transaction(admin => {
        if (admin) {
          if (admin[uid]) {
            admin[uid] = null;
            AlertMsg = 'Admin Permission Removed';
          } else {
            admin[uid] = true;
            AlertMsg = 'Admin Permission Granted';
          }
        }
        return admin;
      });
      Alert.info(AlertMsg, 4000);
    },
    [chatId]
  );

  const handleLike = useCallback(async msgId => {
    const { uid } = auth.currentUser;
    const messageRef = database.ref(`/messages/${msgId}`);

    let AlertMsg;
    await messageRef.transaction(msg => {
      if (msg) {
        if (msg.likes && msg.likes[uid]) {
          msg.LikeCount -= 1;
          msg.likes[uid] = null;
          AlertMsg = 'Like Removed';
        } else {
          msg.LikeCount += 1;

          if (!msg.likes) {
            msg.likes = {};
          }

          msg.likes[uid] = true;
          AlertMsg = 'Like Added';
        }
      }
      return msg;
    });
    Alert.info(AlertMsg, 4000);
  }, []);

  const handleDelete = useCallback(
    async (msgId, file) => {
      // eslint-disable-next-line no-alert
      if (!window.confirm('Delete this message?')) {
        return;
      }

      const Last = Message[Message.length - 1].id === msgId;

      const updates = {};

      updates[`/messages/${msgId}`] = null;

      if (Last && Message.length > 1) {
        updates[`/rooms/${chatId}/lastMessage`] = {
          ...Message[Message.length - 2],
          msgId: Message[Message.length - 2].id,
        };
      }

      if (Last && Message.length === 0) {
        updates[`/rooms/${chatId}/lastMessage`] = null;
      }

      try {
        await database.ref().update(updates);

        Alert.info('Message has been deleted');
      } catch (err) {
        return Alert.error(err.message);
      }

      if (file) {
        try {
          const FileRef = storage.refFromURL(file.url);
          await FileRef.delete();
          Alert.info('Message has been deleted');
        } catch (err) {
          Alert.error(err.message);
        }
      }
    },

    [chatId, Message]
  );

  const RenderMessage = () => {
    const group = groupBy(Message, item =>
      new Date(item.createdAt).toDateString()
    );

    const items = [];

    Object.keys(group).forEach(date => {
      items.push(
        <li key={date} className="text-center mb-1 padded">
          {date}
        </li>
      );

      const msgs = group[date].map(msg => (
        <MessageItem
          key={msg.id}
          message={msg}
          HandleAdmin={HandleAdmin}
          handleLike={handleLike}
          handleDelete={handleDelete}
        />
      ));

      items.push(...msgs);
    });
    return items;
  };

  return (
    <ul ref={selfRef} className="msg-list custom-scroll">
      {Message && Message.length >= Pagesize && (
        <li className="text-center mt-2 mb-2">
          <Button onClick={loadMore}>Load More</Button>
        </li>
      )}
      {ChatEmpty && <li>No Messages Yet..</li>}
      {DisplayMessage && RenderMessage()}
    </ul>
  );
};

export default Messages;
