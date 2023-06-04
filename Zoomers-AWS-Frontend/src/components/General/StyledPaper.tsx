import { Paper } from '@mui/material';
import styled from '@emotion/styled';

const StyledPaper = styled(Paper)`
    background-color:${(props:any) => props.theme.palette.primary.main};
    text-align:left;
    padding: 10px;
`;

export default StyledPaper;
