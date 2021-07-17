<template>
  <div>
    <q-card class="roundedCard q-ma-sm" flat bordered style="width: 95%">
      <q-card-section>
        <div class="row">
          <!-- <q-skeleton :type="headerType" /> -->
          <span class="text-grey q-ml-sm">{{ message }}</span>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-skeleton v-if="bodyType !== 'QRadio'" :type="bodyType" />
        <div v-if="bodyType == 'QRadio'" class="row">
          <q-skeleton :type="bodyType" />
          <q-skeleton class="q-ml-xs" type="text" width="15vw" />
          <q-skeleton class="q-ml-sm" :type="bodyType" />
          <q-skeleton class="q-ml-xs" type="text" width="15vw" />
          <q-skeleton class="q-ml-sm" :type="bodyType" />
          <q-skeleton class="q-ml-xs" type="text" width="15vw" />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  props: ["message", "headerType", "bodyType"],
};
</script>

<style></style>
