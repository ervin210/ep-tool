import React from 'react';
import { isPresent } from 'ts-is-present';
import { useViewContext } from './ViewContext';

/*
I want a class that can take a context object and route requests
based on the Forge Context object. I want to be able to use something similar
to React Router, but not, to be able to select the UI that should
be rendered.

interface Context {
  accountId?: string;
  cloudId?: string;
  extension: ExtensionData;
  license?: LicenseDetails;
  localId: string;
  locale: string;
  moduleKey: string;
  siteUrl: string;
  timezone: string;
}
*/
export function ContextRoute (props) {
  const context = useViewContext();

  console.log('context', context);

  if (!isPresent(context)) {
    throw new Error('You must use a ContextRoute within a ViewContext.');
  }

  if (isPresent(props.moduleKey) && props.moduleKey !== context.moduleKey) {
    return <></>;
  }

  // TODO Maybe this should be modalKey?
  const contextModalType = context?.extension?.modal?.type;
  console.log('contextModalType', contextModalType);
  if (isPresent(props.modalType) && (!isPresent(contextModalType) || props.modalType !== contextModalType)) {
    return <></>;
  }

  if (props.noModal && isPresent(context?.extension?.modal)) {
    return <></>;
  }

  return props.children;
}
