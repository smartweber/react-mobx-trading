import React, { memo } from 'react';

import { Container, ZoomButton, FlexWrapper } from './styles';

const ChartControls = memo(({ midPrice, onZoom, plusDisabled, minusDisabled }) => {
  if (!midPrice) {
    return null;
  }

  return (
    <Container>
      <FlexWrapper>
        <ZoomButton
          type="out"
          alt="Zoom out"
          disabled={minusDisabled}
          onClick={() => !minusDisabled && onZoom('out')}
        />
        <ZoomButton type="in" alt="Zoom in" disabled={plusDisabled} onClick={() => !plusDisabled && onZoom('in')} />
      </FlexWrapper>
    </Container>
  );
});

export default ChartControls;
