import * as React from 'react';
import {
  DataGrid, GridColDef, GridToolbarContainer, GridToolbarFilterButton, GridRenderCellParams,
} from '@mui/x-data-grid';
// When using TypeScript 4.x and above
import { ThemeProvider } from '@emotion/react';
import { createTheme, Theme } from '@mui/material/styles';
import { useTheme } from '@mui/styles';
import CompletedTournamentCard from './CompletedTournamentCard';
import { TournamentRow } from '../AdminComponents/ManageTournaments/ManageTournamentsEnums';

// export interface TournamentRow {
//   id: Number,
//   name: String,
//   description: String,
//   location: String,
//   startDate: Date,
//   numberOfMatches: number,
//   allTournamentDetails: Tournament
// }

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Name',
    hide: true,
  },
  {
    field: 'description',
    headerName: 'Description',
    sortable: false,
    hide: true,
  },
  {
    field: 'startDate',
    headerName: 'Start Date',
    type: 'date',
    hide: true,
  },
  {
    field: 'location',
    headerName: 'Location',
    hide: true,
  },
  {
    field: 'number of matches',
    headerName: 'Registration Closing Date',
    type: 'date',
    hide: true,
  },
  {
    field: 'allTournamentDetails',
    headerName: 'Completed Tournaments',
    hide: false,
    flex: 1,
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params: GridRenderCellParams<any>) => <CompletedTournamentCard tournament={params.value} />,
  },
];

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );
}

interface CompletedTournamentsGridProps {
  tournamentRows:TournamentRow[]
}
export default function CompletedTournamentsGrid({ tournamentRows }:CompletedTournamentsGridProps) {
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

  return (
    <ThemeProvider theme={theme}>
      <div style={{ height: '100vh', width: '100%' }}>
        <div style={{ display: 'flex', height: '100%' }}>
          <div style={{ flexGrow: 1 }}>
            <DataGrid
              components={{ Toolbar: CustomToolbar }}
              isRowSelectable={() => false}
              rows={tournamentRows}
              columns={columns}
              rowHeight={200}
            />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
