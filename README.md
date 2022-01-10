# ibs-test
# Aplicación de citas 🗓️ 📆

## APK y uso

Link del APK:
https://expo.dev/accounts/jorgemar/projects/ibs-test/builds/93286f72-de26-4941-9cac-ac143fdc2b60

Puede instalar el apk tanto en un device como en un emulador.

### Cuentas

_Todo en minúsculas._

 Cuenta  | Email | Contraseña 
------------- | ------------- | ------------- 
Admin  | admin@ibs.com  | admin123
Usuario  | user@ibs.com  | user123


El registro es totalmente funcional pero la cuenta admin la creo desde Firebase.

Cualquier detalle me pueden contactar: <a href='tel:+18095193554'>(809)519-3554</a> o jjasselmartinez@gmail.com


### Requisitos
```
Desarrollo de una aplicación Móvil tanto para Android como IOS, que permita programar citas de servicios.
Eje. Servicios médicos, de taller, salón de belleza, etc.
Que el usuario puede hacer la solicitud he dicho servicio.
```

Simple aplicación de citas desarrollada en React Native utilizando <a href='https://expo.dev/' target='_blank'>Expo</a> para el UI y un backend serverless de la mano de Firebase. La aplicación cuenta con autenticación, permite visualizar y realizar solicitudes de citas desde la cuenta de un usuario común, así como manejar las solicitudes desde una cuenta de administrador. 

## Librerias utilizadas

* React Navigation: para navegar entre pantallas.
* UI Kitten: para utilizar ciertos componentes básicos prehechos y que sean compatibles para el dark mode.
* Firebase: para la autenticación y el manejo de la base de datos con firestore.
* Formik: para el manejo de los formularios.
* Yup: para las validaciones de los formularios.
* Lottie: para algunas animaciones.
* React native calendars: para visualizar las citas con Agenda y Calendar.
* React native modal datetime picker: para los selectores de fechas y tiempos al crear una solicitud de cita.
* ... Entre otras que expo utiliza under the hood.

### Pantalla de registro


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

