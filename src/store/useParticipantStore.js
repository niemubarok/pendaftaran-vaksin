import { reactive, ref } from "vue";
import axios from "axios";
import { db, participants, quota } from "src/boot/firebase";
import { date } from "quasar";

const data = {
  participant: {
    detail: {
      name: "",
      nik: "",
      phone: "",
    },
  },
  registrationDetail: {
    date: "",
    time: "",
    quota: {
      sessionOne: 0,
      sessionTwo: 0,
      sessionThree: 0,
    },
    maxQuota: 150,
  },
};

const state = reactive(data);
const actions = {
  isDateFilled: () => {
    if (state.registrationDetail.date !== "") {
      return true;
    }
    return false;
  },
  setDate: (date) => {
    state.registrationDetail.date = date;
  },
  setTime: (time) => {
    state.registrationDetail.time = time;
  },
  addQuota: () => {
    const dateForDB = state.registrationDetail.date;
    console.log(state.registrationDetail.date);
    const docRef = db.collection("quota").doc(dateForDB);
    docRef
      .get()
      .then((doc) => {
        if (!doc.exists) {
          docRef.set({
            date:`${dateForDB}`,
            maxQuota:state.maxQuota,
            sessionOne: 0,
            sessionTwo: 0,
            sessionThree: 0,
          });
        }
        if (doc.exists) {
          let sessionOneQuota = doc.data().sessionOne;
          let sessionTwoQuota = doc.data().sessionTwo;
          let sessionThreeQuota = doc.data().sessionThree;
          if (state.registrationDetail.time == "sessionOne") {
            docRef.update({
              sessionOne: sessionOneQuota + 1,
              sessionTwo: sessionTwoQuota,
              sessionThree: sessionThreeQuota,
            });
          } else if (state.registrationDetail.time == "sessionTwo") {
            docRef.update({
              sessionOne: sessionOneQuota,
              sessionTwo: sessionTwoQuota + 1,
              sessionThree: sessionThreeQuota,
            });
          } else {
            docRef.update({
              sessionOne: sessionOneQuota,
              sessionTwo: sessionTwoQuota,
              sessionThree: sessionThreeQuota + 1,
            });
          }
        }
        // console.log(quota);

        // } else {
        //   console.log("no data");
        // }
      })
      .catch((err) => {
        console.log(err);
      });
  },
  reduceQuota: () => {
    if (state.registrationDetail.quota !== 0) {
      state.registrationDetail.quota--;
    }
  },
  getDataFromFirestore: () => {
    // const docRef = db.collection("quota").doc("15072021");
    // docRef
    //   .get()
    //   .then((doc) => {
    //     if (doc.exists) {
    //       console.log(doc.data());
    //     } else {
    //       console.log("no data");
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    // getDataCollection("quota", "15072021")
  },
  uploadDataToFirestore: () => {
    const date = state.registrationDetail.date;
    let time = state.registrationDetail.time;
    db.collection("participants")
      .doc(date)
      .set(
        {
          [state.participant.detail.nik]: {
            name: state.participant.detail.name,
            phone: "08" + state.participant.detail.phone,
            time,
          },
        },
        { merge: true }
      )
      .then(() => {
        // db.collection("quota")
        //   .doc(date)
        //   .set({
        //     sessionOne: 0,
        //     sessionTwo: 0,
        //     sessionThree: 0,
        //   });
        actions.addQuota()
        console.log("success");
      })
      .catch((error) => {
        console.log(error);
      });
  },
};

const getters = {
  getDetails: () => {
    return state.participant.detail;
  },
};

export default () => ({
  state: state,
  ...getters,
  ...actions,
});
