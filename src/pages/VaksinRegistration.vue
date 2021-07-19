<template>
  <!-- {{ participant.registrationDetail.quota }} -->
  <img v-if="$q.screen.lt.md" src="~assets/header.png" class="full-width" />

<q-card v-if="$q.screen.gt.sm" class="q-ma-md roundedCard bg-primary">
  <q-card-section>
  <q-chip color="secondary" text-color="grey-1">RS Ali Sibroh Malisi</q-chip>
  <h4 class="text-grey-9">Formulir Pendaftaran Vaksin Covid-19</h4>
  </q-card-section>
</q-card>
  <!-- <q-form @submit="onSubmit"> -->
  <div :style="$q.screen.lt.md ? 'margin-top:-40%' : ''">
    <q-card class="q-mx-sm q-pb-sm roundedCard">
      <div>
        <q-chip color="primary" class="q-mb-sm"> Tanggal Vaksin </q-chip>
      </div>
      <choose-date class="q-ml-sm" />
    </q-card>
    <!-- JAM KEDATANGAN -->
    <skeleton
      v-if="!isDateFilled()"
      headerType="QChip"
      bodyType="QRadio"
      message="Jam Datang"
    />
    <q-card v-if="isDateFilled()" class="q-ma-sm roundedCard">
      <div>
        <q-chip color="primary" text-color="dark">
          Sesi Kedatangan
        </q-chip>
      </div>
      <q-card-section>
        <div class="row">
          <q-radio
            :disable="participant.registrationDetail.quota.sessionOne >= 1"
            v-model="participant.registrationDetail.session"
            val="sessionOne"
            color="green"
            label="08.00-10.00"
          >
            <q-tooltip> kuota full </q-tooltip>
          </q-radio>
          <q-radio
            v-model="participant.registrationDetail.session"
            val="sessionTwo"
            color="orange"
            label="10.00-12.00"
          />
          <q-radio
            v-model="participant.registrationDetail.session"
            val="sessionThree"
            color="orange-10"
            label="13.00-15.00"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- NIK -->
    <skeleton
      v-if="participant.registrationDetail.session == ''"
      headerType="QChip"
      bodyType="rect"
      message="Nomor Induk Kependudukan"
    />
    <q-card
      v-if="participant.registrationDetail.session !== ''"
      class="q-ma-sm roundedCard"
    >
      <div>
        <q-chip color="primary"> Nomor Induk Kependudukan </q-chip>
      </div>
      <q-card-section>
        <q-input
          v-model="participant.participant.detail.nik"
          rounded
          label="Masukan 16 digit NIK anda"
          color="primary"
          mask="################"
          :rules="[
            (val) =>
              val.length > 15 || 'NIK anda masih kurang, mohon cek kembali!',
            (val) =>
              (val.length > 15 && val.length < 17) ||
              'NIK anda terlalu banyak, mohon cek kembali!',
          ]"
        />
      </q-card-section>
    </q-card>

    <!-- NAMA LENGKAP -->
    <skeleton
      v-if="participant.participant.detail.nik.length < 16"
      headerType="QChip"
      bodyType="rect"
      message="Nama Lengkap"
    />
    <q-card
      v-if="participant.participant.detail.nik.length >= 16"
      class="q-ma-sm roundedCard"
    >
      <div>
        <q-chip color="primary"> Nama Lengkap </q-chip>
      </div>
      <q-card-section>
        <q-input
          v-model="participant.participant.detail.name"
          rounded
          label="Masukan Nama Lengkap Sesuai KTP"
          color="primary"
          :rules="[
            (val) => val !== '' || 'Silahkan masukkan nama lengkap anda!',
          ]"
        />
      </q-card-section>
    </q-card>

    <!-- NOMOR HANDPHONE -->
    <skeleton
      v-if="participant.participant.detail.name.length < 3"
      headerType="QChip"
      bodyType="rect"
      message="Nomor Whatsapp"
    />
    <q-card
      v-if="participant.participant.detail.name.length >= 3"
      class="q-ma-sm roundedCard"
    >
      <div>
        <q-chip color="primary"> Nomor Whatsapp </q-chip>
      </div>
      <q-card-section>
        <q-input
          v-model="participant.participant.detail.phone"
          rounded
          label="Masukan Nomor Whatsapp"
          mask="##-####-####"
          prefix="08"
          color="primary"
          :rules="[
            (val) => val.length > 6 || 'Masukan nomor whatsapp yang benar',
          ]"
        />
      </q-card-section>
    </q-card>

    <q-card-section>
      <q-btn
      rounded
        @click="onSubmit"
        type="submit"
        class="full-width"
        color="secondary"
        >Daftarkan Saya</q-btn
      >
    </q-card-section>
  </div>
  <dialog-confirmation />
  <!-- </q-form> -->
</template>

<script>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import ChooseDate from "src/components/ChooseDate.vue";
import Stepper from "src/components/Stepper.vue";
import useComponentStore from "src/store/useComponentStore";
import useParticipantStore from "src/store/useParticipantStore";
import Skeleton from "src/components/Skeleton.vue";
import useQuotaStore from "src/store/useQuotaStore";
import dialogConfirmation from "src/components/dialogConfirmation.vue";

export default {
  components: { ChooseDate, Stepper, Skeleton, dialogConfirmation },
  setup() {
    const $q = useQuasar();
    const { state } = useComponentStore();
    const { setQuotaForOneWeek, setAvailableDate, getAvailableDate } =
      useQuotaStore();
    const {
      state: participant,
      getDetails,
      isDateFilled,
      uploadDataToFirestore,
      addQuota,
    } = useParticipantStore();

    const onSubmit = () => {
      if (participant.registrationDetail.date == "") {
        $q.notify({
          message: "Anda belum menentukan tanggal vaksin",
          color: "red",
        });
      }
      state.showDialog = true;
      uploadDataToFirestore();
      addQuota();
      // if (participant.registrationDetail.date !== "") {
      // }
    };

    onMounted(() => {
      // getCurrentQuota("Jum'at, 16-07-2021").then(quota=>{
      //   console.log(quota.sessionOne);
      // });
      setAvailableDate();
      getAvailableDate();
      setQuotaForOneWeek();
    });
    return {
      isDateFilled,
      onSubmit,
      state,
      participant,
      getDetails: getDetails(),
      registrationSession: ref(""),
    };
  },
};
</script>

<style></style>
