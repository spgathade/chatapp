import { useCallback, useEffect, useRef, useState } from 'react';
import { database } from './firebase';

export function useModalState(defaultvalue = false) {
  const [isOpen, setisOpen] = useState(defaultvalue);
  const Open = useCallback(() => {
    setisOpen(true);
  }, []);
  const Close = useCallback(() => {
    setisOpen(false);
  }, []);

  return { Open, isOpen, Close };
}

export const useMediaQuery = query => {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    const queryList = window.matchMedia(query);
    setMatches(queryList.matches);

    const listener = evt => {
      setMatches(evt.matches);
    };

    queryList.addListener(listener);
    return () => queryList.removeListener(listener);
  }, [query]);

  return matches;
};

export function usePresence(uid) {
  const [Presence, setPresence] = useState(null);

  useEffect(() => {
    const UserbyRef = database.ref(`/status/${uid}`);

    UserbyRef.on('value', snap => {
      if (snap.exists()) {
        const data = snap.val();

        setPresence(data);
      }
    });
    return () => {
      UserbyRef.off();
    };
  }, [uid]);
  return Presence;
}

export function useHover() {
  const [value, setValue] = useState(false);
  const ref = useRef(null);
  const handleMouseOver = () => setValue(true);
  const handleMouseOut = () => setValue(false);
  useEffect(
    () => {
      const node = ref.current;
      if (node) {
        node.addEventListener('mouseover', handleMouseOver);
        node.addEventListener('mouseout', handleMouseOut);
      }
      return () => {
        node.removeEventListener('mouseover', handleMouseOver);
        node.removeEventListener('mouseout', handleMouseOut);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ref.current] // Recall only if ref changes
  );
  return [ref, value];
}
