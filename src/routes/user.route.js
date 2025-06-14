import {Router} from 'express';
import {
    RegisterUser,
    LoginUser,
    LogoutUser,
    updatePassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    getUserChannelProfile,
    getWatchHistory
} from '../controllers/user.controller.js'
import {uploads} from '../middlewares/multer.middleware.js'
import {verifyJwt} from '../middlewares/auth.middleware.js';
import {generateNewRefreshToken} from '../controllers/user.controller.js'
const router = Router();

router.route('/register').post(
    uploads.fields([      //d1
        {name:'avatar',maxCount:1},
        {name:'coverImage',maxCount:1}
    ]),
    RegisterUser);

router.route('/login').post(uploads.none(),LoginUser); //for enabling form data too uploads.none()
router.route('/refresh-token').post(generateNewRefreshToken);
//secured routes
router.route('/logout').post(verifyJwt,LogoutUser);
router.route('/update-password').post(uploads.none(),verifyJwt,updatePassword);
router.route('/update-account').patch(verifyJwt,updateAccountDetails);
router.route('/get-current-user').get(verifyJwt,getCurrentUser);
router.route('/update-file').patch(verifyJwt,uploads.single('avatar'),updateUserAvatar);
router.route('/user-profile/:username').get(verifyJwt,getUserChannelProfile)
router.route('/watch-history').get(verifyJwt,getWatchHistory)
export default router;