import React, { useContext } from 'react';
import { Nav, INavLinkGroup } from '@fluentui/react/lib/Nav';
import { useNavigate } from 'react-router-dom';
import { AppRolesContext } from '../../contexts/AppRolesContext';
import { RoleName } from '../../models/roleNames';

export const LeftNav: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const appRolesCtx = useContext(AppRolesContext);

  const navLinkGroups: INavLinkGroup[] = [
    {
      links: [
        {
          name: 'Workspaces',
          url: '/',
          key: '/',
          icon: 'WebAppBuilderFragment'
        }
      ],
    },
  ];

  // show shared-services link if TRE Admin
  if (appRolesCtx.roles.includes(RoleName.TREAdmin)) {
    navLinkGroups[0].links.push(
      {
        name: 'Shared Services',
        url: '/shared-services',
        key: 'shared-services',
        icon: 'Puzzle'
      });
  }

    // show dashboard link if TRE Admin
  if (appRolesCtx.roles.includes(RoleName.TREAdmin)) {
    navLinkGroups[0].links.push(
      {
        name: 'Dashboard',
        url: '/dashboard',
        key: 'dashboard',
        icon: 'Info'
      });
  }

      // show dashboard link if TRE Admin
  if (appRolesCtx.roles.includes(RoleName.TREAdmin)) {
    navLinkGroups[0].links.push(
      {
        name: 'Dashboard2',
        url: '/dashboard2',
        key: 'dashboard2',
        icon: 'Info'
      });
  }

  return (
    <Nav
      onLinkClick={(e, item) => { e?.preventDefault(); item?.url && navigate(item.url) }}
      ariaLabel="TRE Left Navigation"
      groups={navLinkGroups}
    />
  );
};

