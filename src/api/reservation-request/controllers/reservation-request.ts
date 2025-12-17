/**
 * reservation-request controller
 */

import { factories } from '@strapi/strapi';

// Cast auf any, bis die generierten Typen das neue UID enthalten.
export default factories.createCoreController('api::reservation-request.reservation-request' as any);
