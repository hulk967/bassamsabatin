Bassam Sabatin Woodworks — Supabase Ready Version

1) افتح Supabase > SQL Editor.
2) انسخ محتوى ملف supabase-setup.sql وشغله مرة واحدة.
3) ارفع ملفات المشروع على GitHub ثم Netlify.
4) إعدادات Netlify:
   Build command: اتركه فارغ
   Publish directory: .
5) افتح الموقع.
6) لفتح لوحة التعديل: اضغط على شعار الموقع 5 مرات بسرعة، أو اضغط Ctrl + Shift + A.
7) يوجد زر مخفي أسفل يمين الصفحة يطلب كلمة سر: bsw-admin

ملاحظات مهمة:
- ملف supabase.js يحتوي رابط Supabase والـ publishable key فقط، وهذا آمن للمتصفح.
- لا تضع Secret Key داخل ملفات الموقع نهائيًا.
- هذا الإصدار يجعل الحفظ يعمل بسهولة. بعد التأكد من كل شيء، الأفضل نضيف Login حقيقي عبر Supabase Auth ونغيّر السياسات حتى لا يقدر يعدل إلا إيميل الأدمن.
- إذا كان جدول projects موجود أصلًا، شغّل ملف SQL الحالي لأنه يستخدم create table if not exists، لكن إذا كان عندك عمود اسمه desc قديمًا، استخدم description في الجداول الجديدة.
