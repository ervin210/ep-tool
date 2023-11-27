import React, {useContext, createContext, useState} from 'react';
import { useEffectAsync } from './useEffectAsync';
import { view } from '@forge/bridge';
import { isPresent } from 'ts-is-present';

const VC = createContext();

export const useViewContext = () => {
  return useContext(VC);
};

export function ViewContext(props) {
  const [context, setContext] = useState(undefined);

  useEffectAsync(async () => {
    setContext(await view.getContext());
  }, context);

  if (!isPresent(context)) {
    // TODO Allow the user to provide a loading state component in the props
    return <></>;
  }

  return <VC.Provider value={context}>{props.children}</VC.Provider>;
}