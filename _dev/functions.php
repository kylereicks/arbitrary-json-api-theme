<?php
define('THEME_NAME', 'base-theme');
define('THEME_VERSION', '0.1.0');
require_once(locate_template('/inc/class-theme-autoloader.php'));
$theme_autoloader = new Theme_Autoloader();

Theme_Setup::init();
