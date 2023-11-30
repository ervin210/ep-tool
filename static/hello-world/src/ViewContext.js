import React, { useContext, createContext, useState } from 'react';
import { useEffectAsync } from './useEffectAsync';
import { view } from '@forge/bridge';
import { isPresent } from 'ts-is-present';

const Context = createContext();

export const useViewContext = () => {
  return useContext(Context);
};

export function ViewContext (props) {
  const [context, setContext] = useState(undefined);

  useEffectAsync(async () => {
    setContext(await view.getContext());
  }, context);

  if (!isPresent(context)) {
    // TODO Allow the user to provide a loading state component in the props
    return <></>;
  }

  return <Context.Provider value={context}>{props.children}</Context.Provider>;
}
