import {Router} from 'express';
import verifyJwt from '../middlewares/auth.middleware.js';
import {
     SubscribeToChannel,
    UnSubscribeToChannel,
    getChannelSubscribers,
    getChannelsSubscribedTo
} from '../controllers/subscription.controller.js';
const router = Router();

router.use(verifyJwt);

router.route('/subscribe:channelId',SubscribeToChannel);
router.route('/unsubscribe:channelId',UnSubscribeToChannel);
router.route('/channel-subscribers',getChannelSubscribers);
router.route('/channels-subscribed-to',getChannelsSubscribedTo);

export default router;