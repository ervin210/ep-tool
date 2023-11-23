import React, { useState } from 'react';
import { useEffectAsync } from './useEffectAsync';
import { StaticRouter } from "react-router-dom/server";
import { isPresent } from 'ts-is-present';
import { view } from '@forge/bridge';

function convertContextToRoute(context) {
  let url = `/module/${context.moduleKey}`;

  if (isPresent(context?.extension?.modal?.type)) {
    url += `/modal/${context.extension.modal.type}`;
  }

  console.log('url', url);
  return url;
}

export const CustomUiRouter = (props) => {
  const [context, setContext] = useState(undefined);

  useEffectAsync(async () => {
    setContext(await view.getContext());
  }, context);

  if (!isPresent(context)) {
    return <></>;
  }

  return (
    <StaticRouter location={convertContextToRoute(context)}>
      {props.children}
    </StaticRouter>
  )
}