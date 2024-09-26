import { login } from '../controllers/authController';
import router from 'express';

const authRouter = router();

authRouter.get('/login', (req, res) => {
    const errorMessage = req.query.error || null;
    res.render('login', { title: 'Login', errorMessage });
});

authRouter.post('/login', async (req, res) => {
    try {
        const token = await login(req);
        
        res.cookie('token', token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict' 
        });

        res.redirect('/admin');
    } catch (error) {
        const errorMessage = encodeURIComponent((error as Error).message);
        res.redirect(`/login?error=${errorMessage}`);
    }
});

authRouter.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

export default authRouter;