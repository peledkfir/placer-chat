import Vue from 'vue';
import VueMoment from 'vue-moment';
import moment from 'moment';

moment.locale('en');

Vue.use(VueMoment, {
	moment,
});
