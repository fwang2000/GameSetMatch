import React from 'react';
import LogoIcon from './LogoIcon';
import LogoName from './LogoName';

function LogoIconNameSideBySide() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '5px' }}>
      <LogoIcon width="50px" height="50px" />
      <LogoName width="50px" height="50px" />
    </div>
  );
}

export default LogoIconNameSideBySide;
