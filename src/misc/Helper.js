export function GetInitials(name) {
  const splitName = name.toUpperCase().split('  ');

  if (splitName.length > 1) {
    return splitName[0][0] + splitName[1][0];
  }
  return splitName[0][0];
}

export function TransformToArraywithID(SnapVal) {
  return SnapVal
    ? Object.keys(SnapVal).map(roomId => {
        return { ...SnapVal[roomId], id: roomId };
      })
    : [];
}

export async function GetUserUpdate(userId, KeytoUpdate, value, database) {
  const Updates = {};

  Updates[`/profiles/${userId}/${KeytoUpdate}`] = value;

  const GetMsg = database
    .ref('/messages')
    .orderByChild('author/uid')
    .equalTo(userId)
    .once('value');

  const GetRooms = database
    .ref('/rooms')
    .orderByChild('lastMessage/author/uid')
    .equalTo(userId)
    .once('value');

  const [mSnap, rSnap] = await Promise.all([GetMsg, GetRooms]);

  mSnap.forEach(MsgSnap => {
    Updates[`/messages/${MsgSnap.key}/author/${KeytoUpdate}`] = value;
  });
  rSnap.forEach(RoomSnap => {
    Updates[`/rooms/${RoomSnap.key}/lastMessage/author/${KeytoUpdate}`] = value;
  });

  return Updates;
}

export function TransformtoArr(Snap) {
  return Snap ? Object.keys(Snap) : [];
}

export function groupBy(array, groupingKeyFn) {
  return array.reduce((result, item) => {
    const GroupingKey = groupingKeyFn(item);

    if (!result[GroupingKey]) {
      result[GroupingKey] = [];
    }
    result[GroupingKey].push(item);

    return result;
  }, {});
}
