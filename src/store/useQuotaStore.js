import { reactive,ref } from "vue";
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
  availableDate: []
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
    for (let i = 0; i < 14; i++) {
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
  setAvailableDate: function(){
    let oneWeekDate = [];
    for (let i = 0; i < 14; i++) {
      const today = new Date();
      const fullDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()+i)
      const day = fullDate.getDay()

      if(day !== 0 && day !== 6){
        const dateFormatted = date.formatDate(fullDate, "YYYY/MM/DD");
        oneWeekDate.push(dateFormatted)
      }
    }

    oneWeekDate.forEach((eachDate) => {
      const formattedEachDate = date.formatDate(eachDate, "DD-MM-YYYY");
      actions.getCurrentQuota(formattedEachDate).then((quota) => {
        const totalQuota =
        quota.sessionOne + quota.sessionTwo + quota.sessionThree;
        const maxQuotaPerDay = quota.maxQuota;
        if (totalQuota <= maxQuotaPerDay ) {
          // if(quota.date.getDay())
          state.availableDate.splice(0, 0, quota.date);
        }
      });
    });
  },
  
};

const getters = {
  getAvailableDate:()=>{
    return state.availableDate
  }
}

export default () => ({
  state,
  ...getters,
  ...actions,
});
