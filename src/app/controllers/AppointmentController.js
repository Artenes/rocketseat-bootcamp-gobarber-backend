import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format } from 'date-fns';

import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      limit: 20,
      // (1 - 1) * 20 = 0, then no appointment will be skipped
      // (2 - 1) * 20 = 20, then will skip 20 appointments
      // and so on...
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          // did not like this, has to get path to have url, but path is sent in response
          include: [{ model: File, as: 'avatar', attributes: ['path', 'url'] }],
        },
      ],
    });
    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    const isValid = await schema.isValid(req.body);
    if (!isValid) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { provider_id, date } = req.body;

    const userProvider = await User.findByPk(provider_id);

    /**
     * Check if provider_is is a provider
     */
    if (!userProvider.provider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }

    /**
     * Check if provider is the logged user
     */
    if (userProvider.id === req.userId) {
      return res
        .status(401)
        .json({ error: 'You cannot create appointmens with yourself' });
    }

    /**
     * Check for past dates
     */
    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    /**
     * Check date availability
     */
    const checkAvailability = await Appointment.findOne({
      where: { provider_id, canceled_at: null, date: hourStart },
    });
    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    /**
     * Notify appointment provider
     */
    const user = await User.findByPk(req.userId);
    const formattedDate = format(hourStart, "dd MMMM H:mm'h'");

    await Notification.create({
      content: `New appointment from ${user.name} scheduled at ${formattedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();