import { reactive } from "vue";
import { db } from "src/boot/firebase";
import { date } from "quasar";

const defaultState = {
  quota: {
    date: "",
    sessionOne: 0,
    sessionTwo: 0,
    sessionThree: 0,
    maxQuota: 0,
  },
  availableDate:[]
};

const state = reactive(defaultState);

const actions = {
  getCurrentQuota: async (dateParam) => {
    if (dateParam) {
      const ref = db.collection("quota").doc(dateParam);
      return ref.get().then((doc) => {
        if (doc.exists) {
          return doc.data();
        }
      });
    }
  },
  setQuotaForOneWeek: () => {
    //Ambil tanggal untuk satu minggu kedepan
    const today = new Date();
    let oneWeekDate = [];
    for (let i = 0; i < 7; i++) {
      oneWeekDate.push(
        date.formatDate(
          new Date(today.getFullYear(), today.getMonth(), today.getDate() + i),
          "DD-MM-YYYY"
        )
      );
    }

    oneWeekDate.forEach((eachDate) => {
      const ref = db.collection("quota").doc(eachDate);
      const formattedDate = eachDate.split("-").reverse().join("/");
      ref
        .get()
        .then((doc) => {
          if (!doc.exists) {
            ref.set({
              maxQuota: 0,
              date: `${formattedDate}`,
              sessionOne: 0,
              sessionTwo: 0,
              sessionThree: 0,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },

  //Mengambil tanggal dalam 1 minggu
  getAvailableDate: function(){
    const today = new Date();
    // const nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate()+7);
    let oneWeekDate = [];
    for (let i = 0; i < 7; i++) {
      oneWeekDate.push(
        date.formatDate(
          new Date(today.getFullYear(), today.getMonth(), today.getDate() + i),
          "YYYY/MM/DD"
        )
      );
    }

    oneWeekDate.forEach((eachDate) => {
      const formattedEachDate = date.formatDate(eachDate, "DD-MM-YYYY");
      // console.log(formattedEachDate);
      actions.getCurrentQuota(formattedEachDate).then((quota) => {
        const totalQuota =
          quota.sessionOne + quota.sessionTwo + quota.sessionThree;
        const maxQuotaPerDay = quota.maxQuota;
        if (totalQuota <= maxQuotaPerDay) {
          state.availableDate.push(quota.date, availableDate.value.length);
        }
      });
    });
  },
};

export default () => ({
  state,
  ...actions,
});
