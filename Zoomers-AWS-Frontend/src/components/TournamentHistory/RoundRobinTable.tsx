/* eslint-disable react/jsx-props-no-spreading */
import { Paper } from '@mui/material';
import * as React from 'react';
import clsx from 'clsx';
import { withStyles, WithStyles } from '@mui/styles';
import { Theme, createTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import TableCell from '@mui/material/TableCell';
import {
  AutoSizer,
  Column,
  Table,
  TableCellRenderer,
  TableHeaderProps,
} from 'react-virtualized';
import BracketService, { RoundRobinMatch } from './SingleEliminationBracketMatch';
import { CompletedTournament } from '../BrowseTournaments/TournamentsService';

const styles = (theme: Theme) => ({
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  table: {
    '& .ReactVirtualized__Table__headerRow': {
      ...(theme.direction === 'rtl' && {
        paddingLeft: '0 !important',
      }),
      ...(theme.direction !== 'rtl' && {
        paddingRight: undefined,
      }),
    },
  },
  tableRow: {
    cursor: 'pointer',

  },
  tableRowHover: {
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },
  tableCell: {
    flex: 1,
    alignText: 'center',
  },
  noClick: {
    cursor: 'initial',
  },
} as const);

interface ColumnData {
  dataKey: string;
  label: string;
  numeric?: boolean;
  width: number;
}

interface Row {
  index: number;
}

interface MuiVirtualizedTableProps extends WithStyles<typeof styles> {
  columns: readonly ColumnData[];
  headerHeight?: number;
  onRowClick?: () => void;
  rowCount: number;
  rowGetter: (row: Row) => RoundRobinMatch;
  rowHeight?: number;
}

class MuiVirtualizedTable extends React.PureComponent<MuiVirtualizedTableProps> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    headerHeight: 48,
    rowHeight: 48,
  };

  getRowClassName = ({ index }: Row) => {
    const { classes, onRowClick } = this.props;

    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    });
  };

  cellRenderer: TableCellRenderer = ({ cellData, columnIndex }) => {
    const {
      columns, classes, rowHeight, onRowClick,
    } = this.props;
    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null,
        })}
        variant="body"
        style={{ height: rowHeight }}
        align={
              (columnIndex != null && columns[columnIndex].numeric) || false
                ? 'right'
                : 'left'
            }
      >
        {cellData}
      </TableCell>
    );
  };

  headerRenderer = ({
    label,
    columnIndex,
  }: TableHeaderProps & { columnIndex: number }) => {
    const { headerHeight, columns, classes } = this.props;

    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
        variant="head"
        style={{ height: headerHeight }}
        align={columns[columnIndex].numeric || false ? 'right' : 'left'}
      >
        <span>{label}</span>
      </TableCell>
    );
  };

  render() {
    const {
      classes, columns, rowHeight, headerHeight, ...tableProps
    } = this.props;
    return (
      <AutoSizer>
        {({ height, width }) => (
          <Table
            height={height}
            width={width}
            rowHeight={rowHeight!}
            gridStyle={{
              direction: 'inherit',
            }}
            headerHeight={headerHeight!}
            className={classes.table}
            {...tableProps}
            rowClassName={this.getRowClassName}
          >
            {columns.map(({ dataKey, ...other }, index) => (
              <Column
                key={dataKey}
                headerRenderer={(headerProps) => this.headerRenderer({
                  ...headerProps,
                  columnIndex: index,
                })}
                className={classes.flexContainer}
                cellRenderer={this.cellRenderer}
                dataKey={dataKey}
                {...other}
              />
            ))}
          </Table>
        )}
      </AutoSizer>
    );
  }
}

const defaultTheme = createTheme();
const VirtualizedTable = withStyles(styles, { defaultTheme })(MuiVirtualizedTable);

// ---

interface CompletedTournamentCardProps {
  tournament:CompletedTournament,
}
// id: number,
//     round: number,
//     match: number,
//     tournamentRoundText: string;
// startTime: string,
//     endTime: string,
//     participants: string[],
//     winner: string,

export default function ReactVirtualizedTable({ tournament }:CompletedTournamentCardProps) {
  const [rows, setRows] = React.useState<RoundRobinMatch[]>([
    {
      id: 1,
      round: 2,
      match: 32,
      tournamentRoundText: '1',
      startTime: '23-04-2022 12:30:00',
      endTime: '23-04-2022 13:00:00',
      participants: ['Emily Carano', 'Kyle Ray'],
      winner: 'Emily Carano',
    },
    {
      id: 1,
      round: 2,
      match: 34,
      tournamentRoundText: '1',
      startTime: '23-04-2022 12:30:00',
      endTime: '23-04-2022 13:00:00',
      participants: ['Emily Carano', 'Kyle Ray'],
      winner: 'Emily Carano',
    }]);

  React.useEffect(() => {
    async function fetchInformation() {
      const answer = await BracketService.getRoundRobinTournamentMatchInfo(tournament.tournamentID);
      setRows(answer);
    }
    fetchInformation();
  }, []);

  return (
    <Paper style={{ height: 400, width: '100%', textAlign: 'center' }}>
      <Typography variant="h6">
        Round Robin Matches
      </Typography>
      <VirtualizedTable
        rowCount={rows.length}
        rowGetter={({ index }) => rows[index]}
        columns={[
          {
            width: 100,
            label: 'Round',
            dataKey: 'round',
            numeric: true,
          },
          {
            width: 400,
            label: 'Participants',
            dataKey: 'participants',
          },
          {
            width: 120,
            label: 'Winner',
            dataKey: 'winner',
          },
        ]}
      />
    </Paper>
  );
}
