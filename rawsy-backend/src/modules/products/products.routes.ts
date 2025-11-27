import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireApprovedSupplier } from "../../middlewares/supplier.middleware";
import { requireAdmin } from "../../middlewares/admin.middleware";
import {
  createProduct,
  getAllProducts,
  getMyProducts,
  updateProduct,
  deleteProduct,
  getProductById,
  getTopRatedProducts,
  searchProducts,
  getAllProductsForAdmin,
  flagProduct,        // new controller
  unflagProduct ,
  reviewProduct      // new controller
} from "./product.controller";
import { uploadProductImage } from "./product.upload.controller";
import { uploadSingle } from "../../middlewares/upload.middleware";
import { deleteProductImage } from "./product.image.controller";
import { addProductReview, getProductReviews } from "./productReview.controller";
import { applyDiscount, removeDiscount } from "./product.discount.controller";

const router = Router();

// ✅ ADMIN: Get all products
router.get("/admin/all", authenticate, requireAdmin, getAllProductsForAdmin);

// ✅ ADMIN: Flag/unflag products
router.put("/admin/all/:productId/flag", authenticate, requireAdmin, flagProduct);
router.put("/admin/all/:productId/unflag", authenticate, requireAdmin, unflagProduct);
// ADMIN — approve/reject product
router.put(
  "/admin/all/:productId/review",
  authenticate,
  requireAdmin,
  reviewProduct
);
router.post("/admin/all/:productId/reviews", authenticate, addProductReview);
router.get("/admin/all/:productId/reviews", getProductReviews);

// ✅ Supplier products
router.get("/mine", authenticate, requireApprovedSupplier, getMyProducts);

// ✅ Product search / top rated / public
router.get("/search/filter", searchProducts);
router.get("/top-rated", getTopRatedProducts);
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// ✅ Supplier: Create / update / delete / upload image
router.post("/", authenticate, requireApprovedSupplier, createProduct);

router.put("/discount/add", authenticate, requireApprovedSupplier, applyDiscount);
router.put("/discount/remove/:productId", authenticate, requireApprovedSupplier, removeDiscount);

router.put("/:id", authenticate, requireApprovedSupplier, updateProduct);
router.delete("/:id", authenticate, requireApprovedSupplier, deleteProduct);

router.post(
  "/:id/upload-image",
  authenticate,
  requireApprovedSupplier,
  (req, res, next) => uploadSingle("image")(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  }),
  uploadProductImage
);

router.delete("/:id/image", authenticate, deleteProductImage);

// ✅ Reviews

export default router;
