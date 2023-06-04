import React from 'react';

import { ThemeProvider } from '@emotion/react';
import { createTheme, Theme } from '@mui/material/styles';
import { useTheme } from '@mui/styles';
import {
  GridToolbarContainer, GridToolbarFilterButton, GridColDef, GridRenderCellParams, DataGrid,
} from '@mui/x-data-grid';

import RegisteredTournamentGridCard from './RegisteredTournamentGridCard';
import { TournamentRow } from '../../BrowseTournaments/BrowseTournamentsGrid';

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );
}

interface RegisteredGridProps{
  tournamentRows: TournamentRow[],
  setTournamentRows: (arg0:TournamentRow[]) => void,
}

function RegisteredGrid({ tournamentRows, setTournamentRows }:RegisteredGridProps) {
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
      field: 'closeRegistrationDate',
      headerName: 'Registration Closing Date',
      type: 'date',
      hide: true,
    },
    {
      field: 'allTournamentDetails',
      headerName: 'Current Tournaments',
      hide: false,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<any>) => (
        <RegisteredTournamentGridCard
          tournament={params.value}
          tournamentRows={tournamentRows}
          setTournamentRows={setTournamentRows}
        />
      ),
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <div style={{ height: '75vh', width: '100%' }}>
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
export default RegisteredGrid;
