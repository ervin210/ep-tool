import React, { useEffect, useState } from 'react';
import { invoke, requestJira, view } from '@forge/bridge';
import AceEditor from "react-ace";
import { useEffectAsync } from './useEffectAsync';
import { isPresent } from 'ts-is-present';

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

async function getPropertyKeys(projectId) {
    const propertiesResponse = await requestJira(`/rest/api/3/project/${projectId}/properties`);
    const propertyPayload = await propertiesResponse.json();
    return propertyPayload.keys.map(p => p.key);
}

async function getProperty(projectId, propertyKey) {
    const propertiesResponse = await requestJira(`/rest/api/3/project/${projectId}/properties/${encodeURIComponent(propertyKey)}`);
    return await propertiesResponse.json();
}

const Property = (props) => {
    const [property, setProperty] = useState(undefined);

    useEffectAsync(async () => {
        setProperty(await getProperty(props.projectId, props.propertyKey));
    }, property);

    if (!isPresent(property)) {
        return (
            <div>
                <h2>{props.propertyKey}</h2>
                <div>Loading...</div>
            </div>
        );
    }

    return (
        <div>
            <h2>{props.propertyKey}</h2>
            <AceEditor
                width='100%'
                height='200px'
                mode="json"
                theme="monokai"
                name="UNIQUE_ID_OF_DIV"
                editorProps={{ $blockScrolling: true }}
                defaultValue={JSON.stringify(property.value, null, 2)}
            />
        </div>
    );
}

function App() {
    const [entityPropertyState, setEntityPropertyState] = useState(undefined);

    useEffectAsync(async () => {
        const context = await view.getContext();
        const projectId = context.extension.project.id;
        setEntityPropertyState({
            projectId,
            keys: await getPropertyKeys(projectId)
        });
    }, entityPropertyState);
    // const [data, setData] = useState(null);

    // useEffect(() => {
    //     invoke('getText', { example: 'my-invoke-variable' }).then(setData);
    // }, []);

    return (
        <div>
            {/* {data ? data : 'Loading...'} */}
            <div>{JSON.stringify(entityPropertyState, null, 2)}</div>
            {isPresent(entityPropertyState) && entityPropertyState.keys.map(key => (
                <Property projectId={entityPropertyState.projectId} propertyKey={key} />
            ))}
        </div>
    );
}

export default App;
