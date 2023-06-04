export interface ReactBigCalendarEvent {
  id:Number,
  title:String,
  start:Date,
  end:Date,
  allDay:boolean,
  matchStatus?: number,
}
