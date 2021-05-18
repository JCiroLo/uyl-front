const en_EN = {
    //Landing:
    subtitle: "Create your own content and share it easily!",
    sign_up_for_free: "Sign up for free",
    log_in: "Log in",
    greeting_landing1: "Hey",
    greeting_landing2: "welcome back to",
    go_to_dashboard: "Go to dashboard",
    //Login
    login: "Log in",
    log_in_below: "Log in below",
    email: "Email",
    pass: "Password",
    or: "OR",
    log_in_fb: "Log in with Facebook",
    log_in_g: "Log in with Google",
    dont_have_account: "Dont have an account?",
    register_now: "Register now",
    //Registry
    greeting_registry: "Welcome to up your link",
    register_below: "Register below",
    name: "Name",
    pass2: "Confirm password",
    sign_up: "Sign up",
    sign_in: "Sign in",
    sign_up_fb: "Sign up with Facebook",
    sign_up_g: "Sign up with Google",
    already_have_account: "Already have an account?",
    //Errors
    error_name_required: "Name field is required",
    error_email_required: "Email filed is required",
    error_email_exists: "Email already exists",
    error_email_not_found: "Email not found",
    error_pass_short: "Password must be at least 6 characters",
    error_pass2_short: "Confirm password field is required",
    error_pass2_not_equals: "Passwords must match",
    //Tooltips
    about_uyl: "About UYL",
    faq: "FAQ",
    preferences: "Preferences",
    new_site: "New site",
    log_out: "Log out",
    dashboard: "Dashboard",
    my_sites: "My sites",
    my_profile: "My profile",
    analytics: "Analytics",
    //Navbar
    search: "Search",
    //Create site
    title: "Title",
    content: "Description",
    thumb: "Thumbnail",
    preview: "Preview",
    create_site: "Create site",
    loading: "Loading",
    go_back: "Go back",
    share: "Share",
    success_create1: "The",
    success_create2: "has been created successfully",
    //Dashboard
    my_recent_sites: "My recent sites",
    views: "views",
    //Dropdowns
    delete: "Deleting",
    dark_mode: "Dark mode",
    light_mode: "Light mode",
    languaje: "Languaje",
    //Modal
    delete_message: "You will remove this site permanently. This action cannot be reversed.",
    cancel: "Cancel",
    accept: "Understood"
}

const es_ES = {
    //Landing:
    subtitle: "¡Crea tu propio contenido y compártelo fácilmente!",
    sign_up_for_free: "Regístrate gratis",
    log_in: "Iniciar sesión",
    greeting_landing1: "Hey",
    greeting_landing2: "bienvenido de vuelta a",
    go_to_dashboard: "Ir al dashboard",
    //Login
    login: "Inicia sesión",
    log_in_below: "Inicia sesión a continuación",
    email: "Correo",
    pass: "Contraseña",
    or: "O",
    log_in_fb: "Inicia sesión con Facebook",
    log_in_g: "Inicia sesión con Google",
    dont_have_account: "¿No tienes cuenta?",
    register_now: "Registrate ahora",
    //Registry
    greeting_registry: "Bienvenido a Up your link",
    register_below: "Regístrate a continuación",
    name: "Nombre",
    pass2: "Confirmar contraseña",
    sign_up: "Regístrate",
    sign_in: "Registrase",
    sign_up_fb: "Regístrate con Facebook",
    sign_up_g: "Regístrarse Google",
    already_have_account: "¿Ya tienes cuenta?",
    //Errors
    error_name_required: "El nombre es obligatorio",
    error_email_required: "El correo es obligatorio",
    error_email_exists: "Este correo ya existe",
    error_email_not_found: "Datos incorrectos",
    error_pass_short: "La contraseña debe tener al menos 6 caracteres",
    error_pass2_short: "La contraseña de confirmación es requerida",
    error_pass2_not_equals: "Las contraseñas no concuerdan",
    //Tooltips
    about_uyl: "Acerca de UYL",
    faq: "FAQ",
    preferences: "Preferencias",
    new_site: "Nuevo sitio",
    log_out: "Cerrar sesión",
    dashboard: "Dashboard",
    my_sites: "Mis sitios",
    my_profile: "Mi perfil",
    analytics: "Analytics",
    //Navbar
    search: "Buscar",
    //Create site
    title: "Título",
    content: "Descripción",
    thumb: "Miniatura",
    preview: "Previsualización",
    create_site: "Crear sitio",
    loading: "Cargando",
    go_back: "Ir atrás",
    share: "Compartir",
    success_create1: "El sitio",
    success_create2: "ha sido creado correctamente",
    //Dashboard
    my_recent_sites: "Mis sitios recientes",
    views: "visitas",
    //Dropdowns
    delete: "Eliminar",
    dark_mode: "Modo oscuro",
    light_mode: "Modo claro",
    languaje: "idioma",
    //Modal
    delete_message: "Eliminarás este sitio permanentemente. Esta acción no podrá revertirse.",
    cancel: "Cancelar",
    accept: "Entiendo"
}

export function getWords(current) {
    switch (current) {
        case "en":
            return en_EN
        case "es":
            return es_ES
        default:
            return en_EN
    }
}