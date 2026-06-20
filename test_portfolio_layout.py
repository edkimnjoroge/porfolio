from pathlib import Path

root = Path(__file__).resolve().parent
app = (root / 'js' / 'app.js').read_text(encoding='utf-8')
init = (root / 'js' / 'init.js').read_text(encoding='utf-8')
style = (root / 'css' / 'style.css').read_text(encoding='utf-8')
index = (root / 'index.html').read_text(encoding='utf-8')
index_light = (root / 'index-light.html').read_text(encoding='utf-8')
profile_image_rule = style.split('.resumo_fn_right .img_holder img{', 1)[1].split('}', 1)[0]
checks = {
    'no fixed card width': 'width:300px' not in app,
    'backup auto-width carousel': 'autoWidth: true' in app and 'items: 4' in app,
    'backup mobile settings': '0: { autoWidth: false, items: 1 }' in app,
    'backup desktop settings': '700: { autoWidth: true, items: 4 }' in app,
    'dynamic carousel excluded from template initializer':
        "$('#portfolio .owl-carousel').not('#portfolio-carousel')" in init,
    'profile JPG is rendered directly in both pages': (
        '<img src="img/Edwin Njoroge Profile Photo.jpg" alt="">' in index
        and '<img src="img/Edwin Njoroge Profile Photo.jpg" alt="">' in index_light
        and 'data-bg-img="img/Edwin Njoroge Profile Photo.jpg"' in index
        and 'data-bg-img="img/Edwin Njoroge Profile Photo.jpg"' in index_light
    ),
    'profile image is visible': 'opacity: 1;' in profile_image_rule,
    'portfolio restores original one-sided wrapper': (
        '<div class="container noright">' in index
        and '<div class="container noright">' in index_light
    ),
    'dark theme defines requested teal background': '--bg-main: #092d38;' in style,
    'dark theme defines related teal surfaces': all(token in style for token in (
        '--bg-deep:', '--bg-surface:', '--bg-surface-deep:', '--border-dark:'
    )),
    'light theme remains light': 'body.light{background-color: #fff;' in style,
}
for name, passed in checks.items():
    print('[{}] {}'.format('PASS' if passed else 'FAIL', name))
if not all(checks.values()):
    raise SystemExit(1)
