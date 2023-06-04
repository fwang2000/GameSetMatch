import { atom } from 'jotai';
import moment from 'moment';
import { momentLocalizer } from 'react-big-calendar';

const loc = momentLocalizer(moment);
// eslint-disable-next-line import/prefer-default-export
export const localizerAtom = atom(loc);
