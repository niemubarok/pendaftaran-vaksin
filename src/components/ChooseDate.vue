<template>
  <q-btn
    push
    icon="event"
    rounded
    :label="
      isDateFilled()
        ? participant.registrationDetail.date
        : 'Pilih Tanggal Yang Tersedia'
    "
    :color="isDateFilled() ? 'positive' : 'orange'"
  >
    <!-- :label="store.componentStore.state.isDateFilled ? proxyDate : 'Pilih Tanggal Vaksin' "
        :color="store.componentStore.state.isDateFilled ? 'positive':'orange'" -->
    <!-- :label="store.componentStore" -->
    <q-popup-proxy
      transition-show="scale"
      transition-hide="scale"
      class="z-max"
      @before-show="updateProxy"
      @before-hide="cancel"
    >
      <q-date v-model="proxyDate" :options="availableDate">
        <div class="row items-center justify-end q-gutter-sm">
          <q-btn
            v-close-popup
            label="Cancel"
            color="primary"
            flat
            @click="cancel"
          />
          <q-btn v-close-popup label="OK" color="primary" flat @click="save" />
        </div>
      </q-date>
    </q-popup-proxy>
  </q-btn>
</template>

<script>
import { date } from "quasar";
import { ref, inject, onMounted } from "vue";
import useComponentStore from "src/store/useComponentStore";
import useParticipantStore from "src/store/useParticipantStore";
import useQuotaStore from "src/store/useQuotaStore";

export default {
  setup() {
    const { state } = useComponentStore();
    const {state:quota, getCurrentQuota, getAvailableDate } = useQuotaStore();
    const {
      state: participant,
      isDateFilled,
      setDate,
      setTime,
      reduceQuota,
      getSessionQuota,
    } = useParticipantStore();
    const store = inject("store");
    const timeStamp = date.formatDate(Date.now(), "YYYY/MM/DD");
    const datePicker = ref(timeStamp);
    const proxyDate = ref(date.formatDate(Date.now(), "dddd, YYYY/MM/DD"));
    const okButtonClicked = ref(false);
    const availableDate = quota.availableDate;

    

    const updateProxy = () => {
      proxyDate.value = datePicker.value;
    };

    const optionFn = (proxyDate) => {
      const aWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const weekend =
        date.formatDate(proxyDate, "dddd") == "Sabtu" ||
        date.formatDate(proxyDate, "dddd") == "Minggu";

      return proxyDate >= timeStamp && new Date(proxyDate) <= aWeek && !weekend;
    };

    const save = () => {
      okButtonClicked.value = true;
      setDate(date.formatDate(proxyDate.value, "dddd, DD-MM-YYYY"));
      // getCurrentQuota("Jum'at, 16-07-2021").then(quota=>{
      // console.log(quota.sessionOne);
      // });
    };
    const cancel = () => {
      if (okButtonClicked.value == false) {
        setDate("");
        setTime("");
        reduceQuota();
      }
      okButtonClicked.value = false;
    };

    // onMounted(() => {
    //   getAvailableDate();
    // });

    return {
      isDateFilled,
      store,
      datePicker,
      proxyDate,
      state,
      participant,
      save,
      cancel,
      optionFn,
      updateProxy,
      availableDate,
    };
  },
};
</script>
