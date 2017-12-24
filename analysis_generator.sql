DELETE FROM analysis;

INSERT INTO analysis(name, duration, schedule) VALUES('urine_analysis', 5, '{
    "monday": { "start": "08:00", "end": "13:00" },
    "tuesday": { "start": "08:00", "end": "13:00" },
    "wednesday": { "start": "08:00", "end": "13:00" },
    "thursday": { "start": "08:00", "end": "13:00" },
    "friday": { "start": "08:00", "end": "13:00" },
    "saturday": "off",
    "sunday": "off"
}');

INSERT INTO analysis(name, duration, schedule) VALUES('stool_analysis', 5, '{
    "monday": { "start": "08:00", "end": "12:00" },
    "tuesday": { "start": "08:00", "end": "12:00" },
    "wednesday": { "start": "08:00", "end": "12:00" },
    "thursday": { "start": "08:00", "end": "12:00" },
    "friday": { "start": "08:00", "end": "12:00" },
    "saturday": "off",
    "sunday": "off"
}');

INSERT INTO analysis(name, duration, schedule) VALUES('uzi', 20, '{
    "monday": { "start": "09:00", "end": "16:00" },
    "tuesday": { "start": "09:00", "end": "16:00" },
    "wednesday": { "start": "09:00", "end": "16:00" },
    "thursday": { "start": "09:00", "end": "16:00" },
    "friday": { "start": "09:00", "end": "16:00" },
    "saturday": "off",
    "sunday": "off"
}');

INSERT INTO analysis(name, duration, schedule) VALUES('cardiogram', 20, '{
    "monday": { "start": "09:00", "end": "16:00" },
    "tuesday": { "start": "09:00", "end": "16:00" },
    "wednesday": { "start": "09:00", "end": "16:00" },
    "thursday": { "start": "09:00", "end": "16:00" },
    "friday": { "start": "09:00", "end": "16:00" },
    "saturday": "off",
    "sunday": "off"
}');

INSERT INTO analysis(name, duration, schedule) VALUES('blood_analysis', 5, '{
    "monday": { "start": "08:00", "end": "11:00" },
    "tuesday": { "start": "08:00", "end": "11:00" },
    "wednesday": { "start": "08:00", "end": "11:00" },
    "thursday": { "start": "08:00", "end": "11:00" },
    "friday": { "start": "08:00", "end": "11:00" },
    "saturday": "off",
    "sunday": "off"
}');