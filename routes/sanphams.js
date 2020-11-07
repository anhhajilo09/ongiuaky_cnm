var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
var sanphamsService = require('../services/sanphams');

//lấy tất cả
router.get('/', function(req, res, next) {
    sanphamsService.getAll().then(data => {
        next({ statusCode: 200, data: data });
    }).catch(err => next(err));
});
//thêm 1
router.post('/', [
    check('ma').custom(value => {
        if (!value)
            return Promise.reject('Bắt buộc nhập');
        return sanphamsService.getOneById(value).then(sp => {
            if (sp) {
                return Promise.reject('Mã sản phẩm tồn tại');
            }
        });
    }),
    check('ten').isLength({ min: 1 }).withMessage("Bắt buộc nhập"),
    check('soluong').matches(/^[1-9]{1}[0-9]*$/).withMessage("Phải là số nguyên tối thiểu là 1"),
], function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        next({ statusCode: 400, errors: errors.array() });
    } else {
        const item = req.body;
        sanphamsService.put(item).then(data => {
            if (data)
                next({ statusCode: 200, message: "Thêm thành công sản phẩm" });
        }).catch(err => next(err));
    }
});
//xóa nhiều
router.post('/delete', function(req, res, next) {
    const items = req.body.masanphams;
    sanphamsService.deleteMuti(items).then((data) => {
        next({ statusCode: 200, message: "Xóa thành công", data: data });
    }).catch(err => next(err));
});
//xóa 1
router.delete('/:ma', function(req, res, next) {
    const ma = req.params.ma;
    sanphamsService.delete(ma).then(data => {
        if (data)
            next({ statusCode: 200, message: "Xóa thành công sản phẩm" });
        else
            next({ statusCode: 404, message: "Không tồn tại mã sản phẩm " + ma });
    }).catch(err => next(err));
});
//lấy 1
router.get('/:ma', function(req, res, next) {
    const ma = req.params.ma;
    sanphamsService.getOneById(ma).then(data => {
        if (data)
            next({ statusCode: 200, data: data });
        else
            next({ statusCode: 404, message: "Không tồn tại mã sản phẩm " + ma });
    }).catch(err => next(err));
});

module.exports = router;