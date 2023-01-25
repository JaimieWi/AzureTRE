import React, { useEffect, useContext, useRef, useState } from 'react';
import { Icon, Shimmer, Stack } from '@fluentui/react';
import { ColumnActionsMode, IColumn, Persona, PersonaSize, ShimmeredDetailsList } from '@fluentui/react';
import { SwatchColorPicker } from '@fluentui/react/lib/SwatchColorPicker';
import { CostsContext } from "../../contexts/CostsContext";
import { LoadingState } from '../../models/loadingState';
import { RoleName } from '../../models/roleNames';
import { APIError } from '../../models/exceptions';
import { ExceptionLayout } from '../shared/ExceptionLayout';
import { AppRolesContext } from '../../contexts/AppRolesContext';import { ApiEndpoint } from '../../models/apiEndpoints';
import { Workspace } from '../../models/workspace';
import { useAuthApiCall, HttpMethod, ResultType } from '../../hooks/useAuthApiCall';
import config from "../../config.json";
import { PowerStateBadge } from './PowerStateBadge';



const items = ["Workspace 0", "Workspace 1", "Workspace 1", "Workspace 2", "Workspace 3", "Workspace 0", "Workspace 4"];
// const researchers = ["Tom", "Evie", "Clive", "Aria", "Ida", "Ned", "Ecko"];

const colorCellsExample1 = [
  { id: 'a', label: 'orange', color: '#ca5010' }
];

export const Dashboard = () => {
  let stateClass = "tre-power-off";
  const costsWriteCtx = useRef(useContext(CostsContext));
  const [workspaces, setWorkspaces] = useState([] as Array<Workspace>);
  const [loadingState, setLoadingState] = useState(LoadingState.Loading);
  const [loadingCostState, setLoadingCostState] = useState(LoadingState.Loading);
  const [apiError, setApiError] = useState({} as APIError);
  const [costApiError, setCostApiError] = useState({} as APIError);
  const appRolesCtx = useContext(AppRolesContext);
  const apiCall = useAuthApiCall();



  useEffect(() => {
    const getWorkspaces = async () => {
      try {
        const r = await apiCall(ApiEndpoint.Workspaces, HttpMethod.Get, undefined, undefined, ResultType.JSON);
        setLoadingState(LoadingState.Ok);
        r && r.workspaces && setWorkspaces(r.workspaces);
      } catch (e:any) {
        e.userMessage = 'Error retrieving resources';
        setApiError(e);
        setLoadingState(LoadingState.Error);
      }
    };

    getWorkspaces();
  }, [apiCall]);

  useEffect(() => {
    const getCosts = async () => {
      try {
        costsWriteCtx.current.setLoadingState(LoadingState.Loading)
        const r = await apiCall(ApiEndpoint.Costs, HttpMethod.Get, undefined, undefined, ResultType.JSON);

        costsWriteCtx.current.setCosts([
          ...r.workspaces,
          ...r.shared_services
        ]);

        costsWriteCtx.current.setLoadingState(LoadingState.Ok)
        setLoadingCostState(LoadingState.Ok);
      }
      catch (e: any) {
        if (e instanceof APIError) {
          if (e.status === 404 /*subscription not supported*/) {
            config.debug && console.warn(e.message);
            setLoadingCostState(LoadingState.NotSupported);
          }
          else if (e.status === 429 /*too many requests*/ || e.status === 503 /*service unavaiable*/) {
            let msg = JSON.parse(e.message);
            let retryAfter = Number(msg.error["retry-after"]);
            config.debug && console.info("retrying after " + retryAfter + " seconds");
            setTimeout(getCosts, retryAfter * 1000);
          }
          else {
            e.userMessage = 'Error retrieving costs';
            setLoadingCostState(LoadingState.Error);
          }
        }
        else {
          e.userMessage = 'Error retrieving costs';
          setLoadingCostState(LoadingState.Error);
        }

        costsWriteCtx.current.setLoadingState(LoadingState.Error)
        setCostApiError(e);
      }
    };

    if (appRolesCtx.roles.includes(RoleName.TREAdmin)) {
      getCosts();
    }

    const ctx = costsWriteCtx.current;

    // run this on unmount - to clear the context
    return (() => ctx.setCosts([]));
  }, [apiCall, appRolesCtx.roles]);

    const columns: IColumn[] = [
      {
        key: 'fileIcon',
        name: 'fileIcon',
        minWidth: 16,
        maxWidth: 16,
        isIconOnly: true,
        onRender: () => { return <Icon iconName="ConnectVirtualMachine" style={{verticalAlign:'bottom', fontSize: 14}} /> }
      },
      {
        key: 'workspace',
        name: 'Workspace',
        ariaLabel: 'Workspace list',
        minWidth: 150,
        maxWidth: 200,
        isResizable: true,
        fieldName: 'workspace',
        onRender: (workspaces: Workspace) => <Persona size={ PersonaSize.size32 } text={"Workspace 1"} />
      },
      {
        key: 'vm',
        name: 'Virtual Machine',
        ariaLabel: 'VM',
        minWidth: 150,
        maxWidth: 200,
        isResizable: true,
        fieldName: 'virtualmachine'
      },
      {
        key: 'researcher',
        name: 'Researcher',
        ariaLabel: 'Researcher for VM',
        minWidth: 70,
        maxWidth: 200,
        isResizable: true,
        fieldName: 'researcher',
        onRender: () => <Persona size={ PersonaSize.size24 } text={"name"} />,
      },
      {
        key: 'status',
        name: 'Status',
        ariaLabel: 'Whether VM is running',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        fieldName: 'researcher'
        // onRender: () => <SwatchColorPicker columnCount={1} cellShape={'circle'} colorCells={colorCellsExample1} />,
      },
      {
        key: 'cost',
        name: 'Cost',
        ariaLabel: 'Cost of VM',
        minWidth: 120,
        data: 'number',
        isResizable: true,
        fieldName: 'cost',
        onRender: () => <Stack.Item style={{maxHeight: 18}} className="tre-badge"><Shimmer/></Stack.Item>
      }
    ];


  return (
    <>
      <Stack className="tre-panel">
        <Stack.Item>
          <Stack horizontal horizontalAlign="space-between">
            <Stack.Item><h1>Dashboard</h1></Stack.Item>
          </Stack>
        </Stack.Item>
      </Stack>
      <div className="tre-resource-panel" style={{padding: '0px'}}>
        <ShimmeredDetailsList
          items={items}
          columns={columns}
          // selectionMode={SelectionMode.none}
          getKey={(item) => item?.id}
          // onItemInvoked={(item) => navigate(item.id)}
          className="tre-table"
          // enableShimmer={loadingState === LoadingState.Loading}
        />
      </div>
    </>

  );
}
