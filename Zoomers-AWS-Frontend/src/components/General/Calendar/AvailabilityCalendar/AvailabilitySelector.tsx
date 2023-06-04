import React from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { Calendar, Views } from 'react-big-calendar';
import { useAtomValue } from 'jotai';
import moment, { Moment } from 'moment';

import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';
import { ReactBigCalendarEvent } from '../../../../interfaces/EventInterface';
import { localizerAtom } from '../../../../atoms/localizerAtom';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import './AvailabilitySelector.css';

const DragAndDropCalendar = withDragAndDrop(Calendar as any);

interface AvailabilitySelectorProps {
  availabilities: ReactBigCalendarEvent[],
  setAvailabilities:(arg0:ReactBigCalendarEvent[]) => void,
}

export type Availability = {
  dayOfWeek:number;
  availabilityString:string
};

export const availabilityStringToEvents = (availabilities: Availability[]):ReactBigCalendarEvent[] => {
  const availabilityEvents:ReactBigCalendarEvent[] = [];

  const getEventForPortion = (start:number, duration:number, date:Moment):ReactBigCalendarEvent => {
    const startTime = date.set('hour', 9 + (start / 2));
    const endTime = moment(startTime);
    endTime.add(duration, 'minutes');
    const event:ReactBigCalendarEvent = {
      id: availabilityEvents.length,
      title: 'Available',
      start: startTime.toDate(),
      end: endTime.toDate(),
      allDay: false,
    };
    return event;
  };

  availabilities.forEach((a:Availability) => {
    const day = new Date();
    const numDaysToAdd = a.dayOfWeek - day.getDay();
    const date = numDaysToAdd < 0 ? moment(day).subtract(Math.abs(numDaysToAdd), 'days') : moment(day).add(numDaysToAdd, 'days');
    date.set('minutes', 0).set('seconds', 0).set('milliseconds', 0);
    let duration = 30;
    let start = -1;

    for (let i = 0; i < 24; i += 1) {
      if (a.availabilityString.charAt(i) === '1') {
        if (start !== -1) {
          duration += 30;
        } else {
          start = i;
        }
      } else {
        // add event to availabilityEvents
        // eslint-disable-next-line no-lonely-if
        if (start !== -1) {
          const event = getEventForPortion(start, duration, date);
          availabilityEvents.push(event);
          duration = 30;
          start = -1;
        }
      }
    }
    // in case it goes to the end
    if (start !== -1) {
      const event = getEventForPortion(start, duration, date);
      availabilityEvents.push(event);
      duration = 30;
      start = -1;
    }
  });

  return availabilityEvents;
};

export const transformEventToAvailabilityString = (start:Date, end:Date) => {
  const availArr = new Array(24).fill(0);
  const sMoment = moment(start);
  const eMoment = moment(end);
  const sHour = start.getHours();
  const sMin = start.getMinutes();
  const duration = moment.duration(eMoment.diff(sMoment)).asMinutes() / 30;

  // 9 is start of day
  const index = (sHour - 9) * 2 + (sMin === 0 ? 0 : 1);
  // eslint-disable-next-line no-plusplus
  for (let j = index; j < index + duration; j++) {
    availArr[j] = 1;
  }
  return availArr.toString().replaceAll(',', '');
};

export const transformToAvailabilityString = (availabilites:ReactBigCalendarEvent[]):Availability[] => {
  const availStringObj:Availability[] = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 7; i++) {
    const availForDay = availabilites.filter((a) => a.start.getDay() === i);
    const availArr = new Array(24).fill(0);
    availForDay.forEach((a) => {
      const sMoment = moment(a.start);
      const eMoment = moment(a.end);
      const sHour = a.start.getHours();
      const sMin = a.start.getMinutes();
      const duration = moment.duration(eMoment.diff(sMoment)).asMinutes() / 30;

      // 9 is start of day
      const index = (sHour - 9) * 2 + (sMin === 0 ? 0 : 1);
      // eslint-disable-next-line no-plusplus
      for (let j = index; j < index + duration; j++) {
        availArr[j] = 1;
      }
    });

    const availString = availArr.toString().replaceAll(',', '');
    availStringObj.push({
      dayOfWeek: i,
      availabilityString: availString,
    });
  }
  return availStringObj;
};

function AvailabilitySelector({ availabilities, setAvailabilities }:AvailabilitySelectorProps) {
  const localizer = useAtomValue(localizerAtom);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarErrorMessage, setsnackbarErrorMessage] = React.useState('');
  const [snackbarType, setsnackbarType] = React.useState<AlertColor>('error');

  const handleSelectSlot = React.useCallback(
    ({ start, end }) => {
      // round up the time slots
      const eventID = availabilities.length;
      const availability: ReactBigCalendarEvent = {
        title: 'Available',
        start,
        end,
        allDay: false,
        id: eventID + 1,
      };
      const updatedAvailabilites = [...availabilities, availability];
      setAvailabilities(updatedAvailabilites);
    },
    [availabilities],
  );

  const handleSelectEvent = React.useCallback(
    (event:any) => {
      const existingAvail = availabilities.find((ev:ReactBigCalendarEvent) => ev.id === event.id);
      if (existingAvail) {
        const filteredAvailabilities = availabilities.filter((ev:ReactBigCalendarEvent) => ev.id !== event.id);
        setAvailabilities(filteredAvailabilities);
      }
    },
    [availabilities],
  );

  const changeEventDetails = React.useCallback(
    ({
      event, start, end,
    }) => {
      setSnackbarOpen(false);
      if (moment(start).day() !== moment(end).day()) {
        setsnackbarErrorMessage('Availability cannot span multiple days.');
        setsnackbarType('error');
        setSnackbarOpen(true);
        return;
      }

      if (moment(start).hour() < 9 || moment(end).hour() > 21) {
        setsnackbarErrorMessage('Availability must between 9 a.m. to 9 p.m.');
        setsnackbarType('error');
        setSnackbarOpen(true);
        return;
      }
      const existingAvail = availabilities.find((ev:ReactBigCalendarEvent) => ev.id === event.id);
      const filteredAvailabilities = availabilities.filter((ev:ReactBigCalendarEvent) => ev.id !== event.id);
      if (existingAvail) {
        const updatedAvails:ReactBigCalendarEvent[] = [...filteredAvailabilities,
          {
            ...existingAvail, start, end,
          },
        ];
        setAvailabilities(updatedAvails);
      }
    },
    [availabilities],
  );

  const { defaultDate, formats } = React.useMemo(
    () => ({
      defaultDate: new Date(),
      formats: {
        dayFormat: (date:any) => date.toLocaleString('default', { weekday: 'long' }),
      },
    }),
    [],
  );

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Paper style={{ padding: '10px' }}>
      <Typography variant="h6">
        Provide your general availability for a week.
      </Typography>
      <Typography variant="body1">
        To delete, click on the availability you provided.
      </Typography>
      <Typography>
        This will be used to help schedule your matches, but there is no guarantee we will schedule only in your provided availability.
      </Typography>
      <div style={{ height: 600 }}>
        <DragAndDropCalendar
          defaultDate={defaultDate}
          defaultView={Views.WEEK}
          events={availabilities}
          localizer={localizer}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          onEventDrop={changeEventDetails}
          onEventResize={changeEventDetails}
          selectable
          toolbar={false}
          formats={formats}
          min={new Date(0, 0, 0, 9, 0, 0)}
          max={new Date(0, 0, 0, 21, 0, 0)}
        />
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbarType} sx={{ width: '100%' }}>
          {snackbarErrorMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default AvailabilitySelector;
