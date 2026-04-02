<?php
/**
 * RevOps Bench Theme functions and definitions.
 *
 * @package revopsbench
 */

/**
 * Enqueue parent theme + child theme styles + Google Fonts
 */
function revopsbench_enqueue_styles() {
	wp_enqueue_style(
		'twentytwentyfour-style',
		get_template_directory_uri() . '/style.css',
		array(),
		wp_get_theme( 'twentytwentyfour' )->get( 'Version' )
	);
	wp_enqueue_style(
		'revopsbench-style',
		get_stylesheet_directory_uri() . '/style.css',
		array( 'twentytwentyfour-style' ),
		'1.0.0'
	);
}
add_action( 'wp_enqueue_scripts', 'revopsbench_enqueue_styles' );

/**
 * Enqueue custom scripts
 */
function revopsbench_enqueue_scripts() {
	// Main interactions script
	wp_enqueue_script(
		'revopsbench-main',
		get_stylesheet_directory_uri() . '/assets/js/main.js',
		array(),
		'2.0.0',
		true
	);

	// Silk wave engine (pure Canvas 2D — no external dependency)
	wp_enqueue_script(
		'revopsbench-waves',
		get_stylesheet_directory_uri() . '/assets/js/three-waves.js',
		array(),
		'3.0.0',
		true
	);
}
add_action( 'wp_enqueue_scripts', 'revopsbench_enqueue_scripts' );

/**
 * Add Google Fonts preconnect to head
 */
function revopsbench_add_preconnect() {
	echo '<link rel="preconnect" href="https://fonts.googleapis.com">' . "\n";
	echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' . "\n";
	echo '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">' . "\n";
}
add_action( 'wp_head', 'revopsbench_add_preconnect', 1 );

/**
 * Register navigation menus
 */
function revopsbench_register_menus() {
	register_nav_menus( array(
		'primary' => __( 'Primary Navigation', 'revopsbench' ),
		'footer'  => __( 'Footer Links', 'revopsbench' ),
	) );
}
add_action( 'after_setup_theme', 'revopsbench_register_menus' );

/**
 * Add theme support features
 */
function revopsbench_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'html5', array(
		'comment-form',
		'comment-list',
		'gallery',
		'caption',
		'style',
		'script',
		'navigation-widgets',
	) );
}
add_action( 'after_setup_theme', 'revopsbench_setup' );

/**
 * Add custom block editor styles
 */
function revopsbench_block_editor_styles() {
	add_editor_style( 'style.css' );
}
add_action( 'after_setup_theme', 'revopsbench_block_editor_styles' );
