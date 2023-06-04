import * as React from 'react';
import {
  DataGrid, GridColDef, GridToolbarContainer, GridToolbarFilterButton, GridRenderCellParams,
} from '@mui/x-data-grid';
// When using TypeScript 4.x and above
import { ThemeProvider } from '@emotion/react';
import { createTheme, Theme } from '@mui/material/styles';
import { useTheme } from '@mui/styles';
import moment from 'moment';
import { Match, MatchHistoryRow, setMatchDetails } from '../../../interfaces/MatchInterface';
import MatchHistoryCard from './MatchHistoryCard';

interface MatchHistoryGridProps {
  matches:Match[],
  setMatches:(argo0:Match[]) => void,
}

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );
}

export default function MatchHistoryGrid({
  matches, setMatches,
}:MatchHistoryGridProps) {
  const mainTheme = useTheme() as Theme;
  const theme = createTheme(mainTheme, {
    components: {
      // Use `MuiDataGrid` on both DataGrid and DataGridPro
      MuiDataGrid: {
        styleOverrides: {
          root: {
            '& .MuiDataGrid-toolbarContainer button': {
              color: mainTheme.palette.text.secondary,
            },
            '& .MuiTablePagination': {
              color: mainTheme.palette.text.secondary,
            },
            '& .MuiDataGrid-cell': {
              borderBottomColor: mainTheme.palette.primary.main,
            },
            '& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-colCell:focus-within,  & .MuiDataGrid-columnHeader:focus-within':
                            {
                              outline: 0,
                            },
            '& .MuiDataGrid-columnsContainer': {
              borderBottomColor: mainTheme.palette.primary.main,
            },
            '& .MuiDataGrid-columnHeaderTitleContainer': {
              fontSize: 'x-large',
            },
            backgroundColor: mainTheme.palette.primary.main,
            borderColor: mainTheme.palette.primary.main,
          },
        },
      },
    },
  });

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      hide: true,
      sortable: false,
    },
    {
      field: 'startTime',
      headerName: 'Start Time',
      hide: true,
    },
    {
      field: 'endTime',
      headerName: 'End Time',
      hide: true,
    },
    {
      field: 'duration',
      headerName: 'Duration',
      hide: true,
    },
    {
      field: 'type',
      headerName: 'Type',
      hide: true,
    },
    {
      field: 'name',
      headerName: 'Name',
      hide: true,
    },
    {
      field: 'location',
      headerName: 'Location',
      hide: true,
    },
    {
      field: 'description',
      headerName: 'Description',
      sortable: false,
      hide: true,
    },
    {
      field: 'allMatchDetails',
      headerName: 'Match History',
      hide: false,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<any>) => <MatchHistoryCard match={params.value} matches={matches} setMatches={setMatches} />,
    },
  ];

  const [matchRows, setMatchRows] = React.useState<MatchHistoryRow[]>([]);

  React.useMemo(() => {
    const pastMatches = matches.filter((match) => moment(match.endTime).isBefore(new Date()));
    const rowData:MatchHistoryRow[] = pastMatches.map((item:Match) => setMatchDetails(item));
    setMatchRows(rowData);
  }, [matches]);

  return (
    <ThemeProvider theme={theme}>
      <div style={{ height: '75vh', width: '100%' }}>
        <div style={{ display: 'flex', height: '100%' }}>
          <div style={{ flexGrow: 1 }}>
            <DataGrid
              components={{ Toolbar: CustomToolbar }}
              isRowSelectable={() => false}
              rows={matchRows}
              columns={columns}
              rowHeight={200}
            />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
