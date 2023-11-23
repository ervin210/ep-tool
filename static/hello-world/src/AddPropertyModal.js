import React from 'react';
import Button, { ButtonGroup, LoadingButton } from '@atlaskit/button';
import { view } from '@forge/bridge';
import AceEditor from "react-ace";
import TextField from '@atlaskit/textfield';

import Form, {
  ErrorMessage,
  Field,
  FormFooter,
  FormHeader,
  FormSection,
  HelperMessage,
  RequiredAsterisk,
  ValidMessage,
} from '@atlaskit/form';


import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 95vh;

  width: calc(100vw - 48px);
  max-width: 100%;
  margin: 0 auto;
  padding-top: 24px;
`;

export const TYPE_CREATE = 'add-property-create';
export const TYPE_CLOSE = 'add-property-close';

export const AddPropertyModal = (props) => {
  function closeModal() {
    view.close({
      type: TYPE_CLOSE
    });
  }

  return (
    <>
      <Container>
        <Form
          onSubmit={(data) => {
            return view.close({
              type: TYPE_CREATE,
              data
            });
          }}
        >
          {({ formProps, submitting }) => (
            <form {...formProps}>
              <FormHeader title="Add property">
                <p aria-hidden="true">
                  Required fields are marked with an asterisk <RequiredAsterisk />
                </p>
              </FormHeader>
              <FormSection>
                <Field
                  aria-required={true}
                  name="propertyKey"
                  label="Property Key"
                  isRequired
                  defaultValue=""
                  validate={(value) => {
                    if (value.length > 255) return 'TOO_LONG';
                    if (value.length < 1) return 'TOO_SHORT';
                    return undefined;
                  }}
                >
                  {({ fieldProps, error }) => (
                    <>
                      <TextField autoComplete="off" {...fieldProps} />
                      {!error && (
                        <HelperMessage>
                          Write a property key less than 255 characters long.
                        </HelperMessage>
                      )}
                      {error && error === 'TOO_LONG' && (
                        <ErrorMessage>
                          The property key is too long; it must be 255 characters or less.
                        </ErrorMessage>
                      )}
                      {error && error === 'TOO_SHORT' && (
                        <ErrorMessage>
                          The property key is too short; write a longer key.
                        </ErrorMessage>
                      )}
                    </>
                  )}
                </Field>
                <Field
                  aria-required={true}
                  name="propertyValue"
                  label="Property value"
                  defaultValue=""
                  isRequired
                  validate={(value) => {
                    try {
                      JSON.parse(value);
                      return undefined;
                    } catch (e) {
                      return 'INVALID_JSON';
                    }
                  }}
                >
                  {({ fieldProps, error, valid, meta }) => {
                    return (
                      <>
                        <AceEditor
                          width='100%'
                          height='200px'
                          mode="json"
                          theme="monokai"
                          name={fieldProps.name}
                          isRequired={fieldProps.isRequired}
                          editorProps={{ $blockScrolling: true }}
                          onChange={(e) => { fieldProps.onChange(e) }}
                        />
                        {error && !valid && (
                          <HelperMessage>
                            You need to write valid JSON in the field above to create the property.
                          </HelperMessage>
                        )}
                        {error && (
                          <ErrorMessage>
                            Please write valid JSON in the above.
                          </ErrorMessage>
                        )}
                        {valid && meta.dirty ? (
                          <ValidMessage>JSON valid!</ValidMessage>
                        ) : null}
                      </>
                    );
                  }}
                </Field>
              </FormSection>

              <FormFooter>
                <ButtonGroup>
                  <Button appearance="subtle" onClick={() => closeModal()}>Cancel</Button>
                  <LoadingButton
                    type="submit"
                    appearance="primary"
                    isLoading={submitting}
                  >
                    Create
                  </LoadingButton>
                </ButtonGroup>
              </FormFooter>
            </form>
          )}
        </Form>
      </Container>
    </>

  );
};