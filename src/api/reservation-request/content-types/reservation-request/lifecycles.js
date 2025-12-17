const REQUEST_UID = 'api::reservation-request.reservation-request';
const CONTAINER_UID = 'api::container.container';

// Wenn ein Request auf "confirmed" geht und ein Container verknüpft ist,
// setze den Container automatisch auf "reserved".
export default {
  async afterUpdate(event) {
    try {
      const request = await strapi.entityService.findOne(REQUEST_UID, event.result.id, {
        populate: ['container'],
      });
      if (request?.status !== 'confirmed' || !request?.container?.id) return;

      await strapi.entityService.update(CONTAINER_UID, request.container.id, {
        data: { availability_status: 'reserved' },
      });
    } catch (err) {
      strapi.log.error('reservation-request afterUpdate failed', err);
    }
  },
};
