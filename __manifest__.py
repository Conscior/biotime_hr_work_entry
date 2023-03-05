{
    'name': 'Biotime Work Entry Integration',
    'version': '15.0.0.0',
    'category': 'Generic Modules/Human Resources',
    'author': 'Ryad Abderrahim',
    'depends': ['biotime_hr_work_entry', 'hr_work_entry',],
    'data': [
        'data/download_data.xml',

        'security/ir.model.access.csv',

        'views/assets.xml',
    ],
    'images': ['static/description/banner.gif'],
    'demo': [],
    'installable': True,
    'auto_install': False,
    'application': False,
}
