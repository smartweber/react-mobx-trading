import styled from 'styled-components/macro';

export const GridWrapper = styled.div`
  position: relative;
  display: flex;
  height: 100%;
  background: ${props => props.theme.palette.clrBackground};
  padding: ${({
      theme: {
        palette: { contentGap }
      }
    }) => `${contentGap} ${contentGap} ${contentGap}`}
    0;

  @media (max-width: 1600px) {
    transform: scale(0.85);
    transform-origin: 0 0;
    width: 117.64%;
    height: 117.64%;
  }

  @media (max-width: 1500px) {
    transform: scale(0.75);
    transform-origin: 0 0;
    width: 133.33%;
    height: 133.33%;
  }

  @media (max-width: 1080px) {
    transform: scale(0.65);
    transform-origin: 0 0;
    width: 153.84%;
    height: 153.84%;
  }

  @media (max-width: 940px) {
    transform: scale(0.55);
    transform-origin: 0 0;
    width: 181.81%;
    height: 181.81%;
  }

  @media (max-width: 790px) {
    transform: scale(0.45);
    transform-origin: 0 0;
    width: 222.22%;
    height: 222.22%;
  }

  @media (max-width: 700px) {
    transform: scale(0.35);
    transform-origin: 0 0;
    width: 285.71%;
    height: 285.71%;
  }

  transform: ${({ isMobilePortrait, isMobileLandscape, isSmallWidth }) => {
    if (isMobileLandscape) return 'scale(0.5) !important';
    if (isMobilePortrait) return 'scale(0.75) !important';
    if (isSmallWidth) return 'scale(1) !important';
  }};

  width: ${({ isMobilePortrait, isMobileLandscape, isSmallWidth }) => {
    if (isMobileLandscape) return '200% !important';
    if (isMobilePortrait) return '133.33% !important';
    if (isSmallWidth) return '100% !important';
  }};

  height: ${({ isMobilePortrait, isMobileLandscape, isSmallWidth }) => {
    if (isMobileLandscape) return '200% !important';
    if (isMobilePortrait) return '133.33% !important';
    if (isSmallWidth) return '100% !important';
  }};
`;

export const RightTopWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  margin-left: 12px;
  ${props => (props.isMobilePortrait || props.isSmallWidth ? 'display: none;' : 'flex: 1;')}
  height: 100%;
`;

export const StyledLeftLowerSectionGrid = styled.div`
  grid-area: leftlowersection;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  height: 100%;
  width: 100%;
  border-radius: ${props => props.theme.palette.borderRadius};
  background: ${props => props.theme.palette.orderFormBg};
  border: 1px solid ${props => props.theme.palette.clrBorder};
`;

export const BuySellOrderWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: stretch;
  height: calc(100% - 38px);
  width: 100%;

  & > * {
    width: 50%;
  }
`;

export const ArbOrderWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: stretch;
  height: calc(100% - 38px);
  width: 100%;

  & > * {
    width: 100%;
  }
`;

export const StyledLeftTopSectionGrid = styled.div`
  position: relative;
  ${props =>
    props.isMobilePortrait || props.isSmallWidth
      ? 'width: calc(100% - 8px);'
      : 'max-width: calc(33% - 12px); width: calc(33% - 12px);'}
  margin-left: ${props => (props.isTrading && !props.isMobilePortrait ? '-33%' : '12px')};
  transition: margin .1s linear;

  & > div:first-child {
      transition: none !important;
      margin-left: 0 !important;
      width: 100% !important;
  }
`;

export const StyledRightLowerSectionGrid = styled.div`
  position: ${props => (props.fullScreen ? 'absolute' : 'relative')};
  width: 100%;
  bottom: 0;
  z-index: 102;
  height: ${props => (props.fullScreen ? '100%' : props.theme.palette.lowerSectionHeight)};
  transition: all 0.3s ease-in-out;
  margin-top: ${props => (props.hasMargin ? '12px' : '0')};
  display: flex;
  flex-direction: column;
  border: 1px solid ${props => props.theme.palette.clrBorder};
  border-radius: ${props => props.theme.palette.borderRadius};
  background-color: ${props => props.theme.palette.clrBackground};
`;

export const StyledRightTopSectionGrid = styled.div`
  position: relative;
  margin-left: 12px;
  ${props =>
    props.isMobilePortrait || props.isSmallWidth
      ? 'display: none;'
      : 'flex: 1; max-width: calc(67% - 12px); width: calc(67% -12px);'}
`;

export const GraphGrid = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const SearchBarGridArea = styled.div`
  grid-area: search;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  min-width: 0;
  height: 60px;
  background-color: ${props => props.theme.palette.clrChartBackground};
  border: 1px solid ${props => props.theme.palette.clrBorder};
  border-radius: ${props => props.theme.palette.borderRadius};
  z-index: ${props => (props.rightBottomSectionFullScreenMode ? '100' : '1000000')};
  margin-bottom: 12px;
`;

export const ChartGridArea = styled.div`
  flex: 1;
  position: relative;
  border: 1px solid ${props => props.theme.palette.clrBorder};
  border-radius: ${props => props.theme.palette.borderRadius};
`;
