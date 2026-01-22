import { sequelize } from './index';
import { Account } from './account';
import { Application } from './application';

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('Database & tables synced!');
  } catch (err) {
    console.error('Unable to sync database:', err);
  } finally {
    await sequelize.close();
  }
})();
