const db = require("../models");
const Courier = db.courier;
const Customer = db.customer;
const User = db.user;
const { Op } = require('sequelize');

exports.getDetails = async(req, res) => {
    try{
        const users = await User.count()
        const admins = await User.count({ where: { roleId: 1}});
        const clerks = await User.count({ where: { roleId: 2}});
        const deliveryBoys = await User.count({ where: { roleId: 3}});
        const customers = await Customer.count()
        const pendingCouriers = await Courier.count({ where: { status: "PENDING"}});
        const progressCouriers = await Courier.count({ where: { status: "PROGRESS"}});
        const deliveredCouriers = await Courier.count({ where: { status: "DELIVERED"}});
        const deliveryInTimeCount = await Courier.count({ where: { isDeliveredInTime: 1}});
        const couriersAmount = await Courier.sum('cost')
        const lastWeek = await this.getLastWeekReport()
        res.send({
            users,
            admins,
            clerks,
            deliveryBoys,
            customers,
            pendingCouriers,
            progressCouriers,
            deliveredCouriers,
            deliveryInTimeCount,
            couriersAmount,
            lastWeek
        })
    }
    catch(e) {
        res.status(500).send({
            message:
            e.message || "Some error occurred while generating report.",
        });
    }
}


exports.getLastWeekReport = async () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
 
    const condition = {
    createdAt: {
        [Op.between]: [oneWeekAgo, new Date()],
    },
    };

    const pendingReport = await db.courier.findAll({
    where: {
        ...condition,
        status: 'PENDING',
    },
    attributes: [
        [db.sequelize.fn('DATE', db.sequelize.col('createdAt')), 'date'],
        [db.sequelize.fn('COUNT', '*'), 'count'],
    ],
    group: [db.sequelize.fn('DATE', db.sequelize.col('createdAt'))],
    raw: true,
    });

    const progressReport = await db.courier.findAll({
    where: {
        ...condition,
        status: 'PROGRESS',
    },
    attributes: [
        [db.sequelize.fn('DATE', db.sequelize.col('createdAt')), 'date'],
        [db.sequelize.fn('COUNT', '*'), 'count'],
    ],
    group: [db.sequelize.fn('DATE', db.sequelize.col('createdAt'))],
    raw: true,
    });

    const deliveredReport = await db.courier.findAll({
    where: {
        ...condition,
        status: 'DELIVERED',
    },
    attributes: [
        [db.sequelize.fn('DATE', db.sequelize.col('deliveredTime')), 'date'],
        [db.sequelize.fn('COUNT', '*'), 'count'],
    ],
    group: [db.sequelize.fn('DATE', db.sequelize.col('deliveredTime'))],
    raw: true,
    });

    const mergedReport = mergeReports(pendingReport, progressReport, deliveredReport);
    return mergedReport
 };
 
 function mergeReports(pending, progress, delivered) {
   const merged = [];
 
   pending.forEach((item) => {
     const date = item.date;
     const pendingCount = item.count;
     const progressCount = findCountByDate(progress, date);
     const deliveredCount = findCountByDate(delivered, date);
     const total = pendingCount + progressCount + deliveredCount;
 
     merged.push({ date, pending: pendingCount, progress: progressCount, delivered: deliveredCount, total });
   });
 
   progress.forEach((item) => {
     const date = item.date;
     const progressCount = item.count;
     const pendingCount = findCountByDate(pending, date);
     const deliveredCount = findCountByDate(delivered, date);
     const total = pendingCount + progressCount + deliveredCount;
 
     // Check if the date is already processed in the pending loop
     const existingItem = merged.find((item) => item.date === date);
     if (!existingItem) {
       merged.push({ date, pending: pendingCount, progress: progressCount, delivered: deliveredCount, total });
     }
   });
 
   delivered.forEach((item) => {
     const date = item.date;
     const deliveredCount = item.count;
     const pendingCount = findCountByDate(pending, date);
     const progressCount = findCountByDate(progress, date);
     const total = pendingCount + progressCount + deliveredCount;
 
     // Check if the date is already processed in the pending or progress loop
     const existingItem = merged.find((item) => item.date === date);
     if (!existingItem) {
       merged.push({ date, pending: pendingCount, progress: progressCount, delivered: deliveredCount, total });
     }
   });
 
   return merged;
 }
 
 function findCountByDate(report, date) {
   const item = report.find((item) => item.date === date);
   return item ? item.count : 0;
 }
 