import Vue from 'vue';
import VueMoment from 'vue-moment';
import moment from 'moment';

moment.locale('he');

Vue.use(VueMoment, {
	moment,
});
