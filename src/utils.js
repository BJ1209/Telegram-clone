import moment from 'moment';

export const timeAgo = (timestamp) => moment(new Date(timestamp?.toDate())).format('LT');
