import {
  Calendar, momentLocalizer, View,
} from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import './Calendar.css';
import React from 'react';
// import { useTheme } from '@emotion/react';
// import { Theme } from '@mui/material/styles';

import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { ReactBigCalendarEvent } from '../../../../interfaces/EventInterface';
import { MatchStatus } from '../../../../interfaces/MatchInterface';

const DragAndDropCalendar = withDragAndDrop(Calendar as any);

interface GeneralBigCalendarProps {
  events:ReactBigCalendarEvent[],
  defaultDate?:Date,
  defaultView?:View | undefined,
  onMatchSelect:(e:any) => void,
  onMatchDrop:(argo0:any) => void,
  onMatchResize?:(arg0:any) => void,
  enableEdit?:boolean,
  height?:number,
}

function GeneralBigDragNDropCalendar({
  events, defaultDate, defaultView, onMatchSelect, onMatchDrop, onMatchResize, enableEdit, height,
}:GeneralBigCalendarProps) {
  moment.locale('en-US');
  const localizer = momentLocalizer(moment);

  const eventPropGetter = React.useCallback(
    (event) => ({
      ...(event?.matchStatus === MatchStatus.BAD && {
        className: 'badMatch',
      }),
      ...(event?.matchStatus === MatchStatus.OK && {
        className: 'okMatch',
      }),
      ...(event?.matchStatus === MatchStatus.GREAT && {
        className: 'greatMatch',
      }),
    }),
    [],
  );

  return (
    <div style={{ height: `${height}px`, margin: '50px' }}>
      {enableEdit
        ? (
          <DragAndDropCalendar
            selectable={enableEdit}
            defaultDate={defaultDate}
            localizer={localizer}
            defaultView={defaultView}
            events={events}
            onEventDrop={onMatchDrop}
            onEventResize={onMatchResize}
            timeslots={2}
            onSelectEvent={(e) => onMatchSelect(e)}
            dayLayoutAlgorithm="no-overlap"
            min={new Date(0, 0, 0, 9, 0, 0)}
            max={new Date(0, 0, 0, 21, 0, 0)}
            eventPropGetter={eventPropGetter}
            popup
          />
        )
        : (
          <Calendar
            defaultDate={defaultDate}
            localizer={localizer}
            defaultView={defaultView}
            events={events}
            timeslots={2}
            onSelectEvent={(e) => onMatchSelect(e)}
            dayLayoutAlgorithm="no-overlap"
            min={new Date(0, 0, 0, 9, 0, 0)}
            max={new Date(0, 0, 0, 21, 0, 0)}
          />
        )}
    </div>
  );
}

GeneralBigDragNDropCalendar.defaultProps = {
  defaultDate: new Date(),
  defaultView: 'month',
  onMatchResize: undefined,
  height: 500,
  enableEdit: false,
};

export default GeneralBigDragNDropCalendar;
