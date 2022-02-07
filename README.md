# Appointments app 🗓️ 📆

### APK

APK:
https://expo.dev/accounts/jorgemar/projects/ibs-test/builds/b3354466-c8a8-4aea-9613-2100740b076c

### Accounts

_Todo en minúsculas._

| Type  | Email         | Password |
| ----- | ------------- | -------- |
| Admin | admin@ibs.com | admin123 |
| User  | user@ibs.com  | user123  |

The register screen is functional for users acccounts but for admin accounts you need to use the credentials provided on the table.

Contact for any details: <a href='tel:+18095193554'>(809)519-3554</a> o jjasselmartinez@gmail.com

### Idea

```
Mobile application for both iOS and Android, that allows the users to create appointment requests and the admin to manage them.
```

Developed using React Native with Expo for the UI and Firebase for the serverless backend. Implemented Firebase Authentication. On one hand the user can updated or delete any appointment request created by him. On the other hand, the admin can update and delete every appointment requests.

## Libraries

- React Navigation.
- UI Kitten.
- Firebase.
- Formik.
- Yup.
- Lottie.
- React native calendars.
- React native modal datetime picker.

### Register

![RegisterValidations](https://user-images.githubusercontent.com/22924299/148800181-7ac8fdb1-d709-4658-8786-3cae689e5e0c.gif)

### Dashboard

![Dashboard](https://user-images.githubusercontent.com/22924299/148820241-28e2a491-103c-493c-b2c1-51e365684e03.gif)

### Modal de solicitud de cita

![Request modal](https://user-images.githubusercontent.com/22924299/148844968-814df227-071a-4ecd-a395-5d89f879bfef.gif)

### Dashboard para el admin

<img width="333" alt="Screen Shot 2022-01-10 at 5 56 49 PM" src="https://user-images.githubusercontent.com/22924299/148845472-3be48008-3f22-4756-a228-5359055089fe.png">

### Manejando las citas

_Perspectiva de usuario en la izquierda y perspectiva de admin en la derecha_

![Manejando las citas](https://user-images.githubusercontent.com/22924299/148848382-a59b919a-b542-44b6-8e3e-0b100a8dc539.gif)

### Detalles que se pueden mejorar

- Performance cuando el manejo de datos y flujo de usuarios es mayor utilizando hooks como useMemo() e implementar librerias de optimización.
- Agregar animaciones cuando se capturan los errores, de actulización de componentes, entre otras.
- Hacer tests automáticos.
- Implementar el dark mode completamente (faltó Agenda y Calendar de react native calendars)
- Optimizar las consultas hacia Firebase para menor costo de operación.
