import express from "express";
import * as AuthController from "../controllers/auth_controller.js";
import * as TradeJournalController from "../controllers/trade_journal_controller.js";
import * as CurrencyPairController from "../controllers/currency_pair_controller.js";
const router = express.Router();

// Public routes || user authorization
router.post("/auth/register", AuthController.register)
router.post("/auth/login", AuthController.login)

// Private routes || user authorization
router.post("/auth/users/logout", AuthController.logout)
router.get("/auth/users/access-token-generate", AuthController.tokenGenerate)
router.get("/auth/users/protected-routes", AuthController.protectedRoutes)
router.get("/auth/users/list", AuthController.show)
router.get("/auth/users/:id", AuthController.single)
router.put("/auth/users/:id", AuthController.update)
router.patch("/auth/users/password-change/:id", AuthController.passwordChange)
router.patch("/auth/users/role/:id", AuthController.changeRole)
router.patch("/auth/users/suspended/:id", AuthController.isSuspended)
router.delete("/auth/users/:id", AuthController.destroy)

// private routes || trade journal
router.post("/trade-journal/create", TradeJournalController.create)
router.get("/trade-journal/show", TradeJournalController.show)
router.get("/trade-journal/single/:id", TradeJournalController.single)
router.put("/trade-journal/update/:id", TradeJournalController.update)
router.delete("/trade-journal/destroy/:id", TradeJournalController.destroy)

// private routes || trade journal
router.post("/currency-pair/create", CurrencyPairController.create)
router.get("/currency-pair/show", CurrencyPairController.show)
router.get("/currency-pair/single/:id", CurrencyPairController.single)
router.put("/currency-pair/update/:id", CurrencyPairController.update)
router.delete("/currency-pair/destroy/:id", CurrencyPairController.destroy)












export default router;