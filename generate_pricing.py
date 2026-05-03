import re
import sys

html_nav = """<div class="category-nav" style="flex-wrap: wrap; gap: 15px;">
                    <button class="category-btn active" data-category="web-dev">Web Development</button>
                    <button class="category-btn" data-category="chatbot">Chatbots</button>
                    <button class="category-btn" data-category="app-dev">App Development</button>
                    <button class="category-btn" data-category="wa-automation">WA Automation</button>
                    <button class="category-btn" data-category="wa-marketing">WA Marketing</button>
                    <button class="category-btn" data-category="email-marketing">Email Marketing</button>
                    <button class="category-btn" data-category="crm">CRM</button>
                    <button class="category-btn" data-category="erp">ERP</button>
                    <button class="category-btn" data-category="seo">SEO</button>
                    <button class="category-btn" data-category="digital-marketing">Digital Marketing</button>
                </div>"""

categories = [
    {
        "id": "web-dev",
        "title": "Web Development",
        "display": "flex",
        "plans": [
            {"type": "Basic", "name": "Basic", "price": "₹30,000", "features": ["Up to 5 pages", "Mobile responsive design", "Contact form integration", "Basic SEO setup", "2 revisions"]},
            {"type": "Standard", "name": "Standard", "price": "₹50,000", "popular": True, "features": ["Up to 10 pages", "Custom UI/UX design", "Blog & dynamic sections", "Full SEO (on-page)", "3 revisions"]},
            {"type": "Premium", "name": "Premium", "price": "₹70,000+", "features": ["15+ pages", "Advanced UI/UX system", "CMS integration", "Speed & security optimization", "Advanced analytics"]}
        ]
    },
    {
        "id": "chatbot",
        "title": "Chatbot Development",
        "display": "none",
        "plans": [
            {"type": "Basic", "name": "Basic", "price": "₹10,000", "features": ["FAQ chatbot", "Website integration", "Basic automation replies", "Lead capture"]},
            {"type": "Standard", "name": "Standard", "price": "₹25,000", "popular": True, "features": ["Lead qualification bot", "CRM integration", "Booking system", "Multi-language support"]},
            {"type": "Premium", "name": "Premium", "price": "₹50,000", "features": ["AI chatbot", "NLP conversations", "Multi-platform bot", "Advanced automation"]}
        ]
    },
    {
        "id": "app-dev",
        "title": "Application Development",
        "display": "none",
        "plans": [
            {"type": "Basic", "name": "Basic", "price": "₹4,00,000", "features": ["Android or iOS app", "Up to 5 screens", "Login system", "Basic database"]},
            {"type": "Standard", "name": "Standard", "price": "₹4,50,000 - ₹6,50,000", "popular": True, "features": ["Android + iOS", "Payment integration", "Admin dashboard", "API integrations"]},
            {"type": "Premium", "name": "Premium", "price": "₹6,50,000+", "features": ["Fully custom app", "Real-time features", "Advanced security", "Cloud infrastructure"]}
        ]
    },
    {
        "id": "wa-automation",
        "title": "WhatsApp Automation",
        "display": "none",
        "plans": [
            {"type": "Basic", "name": "Basic", "price": "₹8,000", "suffix": "/one-time", "features": ["Chatbot setup", "Auto replies", "Lead capture form", "Basic workflows"]},
            {"type": "Standard", "name": "Standard", "price": "₹18,000", "popular": True, "features": ["Advanced chatbot flows", "CRM integration", "Broadcast automation", "Booking automation"]},
            {"type": "Premium", "name": "Premium", "price": "₹35,000", "features": ["Full automation system", "API integrations", "Sales funnel automation", "Analytics dashboard"]}
        ]
    },
    {
        "id": "wa-marketing",
        "title": "WhatsApp Marketing",
        "display": "none",
        "plans": [
            {"type": "Basic", "name": "Basic", "price": "₹5,000", "suffix": "/mo", "features": ["2 campaigns", "Message templates", "Scheduling", "Basic reports"]},
            {"type": "Standard", "name": "Standard", "price": "₹10,000", "suffix": "/mo", "popular": True, "features": ["4 campaigns/month", "Customer segmentation", "Optimization", "Analytics"]},
            {"type": "Premium", "name": "Premium", "price": "₹18,000", "suffix": "/mo", "features": ["Advanced campaigns", "Funnel automation", "CRM integration", "Lead scoring"]}
        ]
    },
    {
        "id": "email-marketing",
        "title": "Email Marketing",
        "display": "none",
        "plans": [
            {"type": "Basic", "name": "Basic", "price": "₹5,000", "suffix": "/mo", "features": ["2 campaigns", "Template design", "Newsletter setup", "Basic automation"]},
            {"type": "Standard", "name": "Standard", "price": "₹12,000", "suffix": "/mo", "popular": True, "features": ["4 campaigns/month", "Funnel setup", "A/B testing", "Optimization"]},
            {"type": "Premium", "name": "Premium", "price": "₹20,000", "suffix": "/mo", "features": ["Advanced automation", "Lead nurturing", "Behavioral triggers", "Weekly reports"]}
        ]
    },
    {
        "id": "crm",
        "title": "CRM Development",
        "display": "none",
        "plans": [
            {"type": "Basic", "name": "Basic", "price": "₹75,000", "features": ["Lead management", "User roles", "Basic dashboard", "Reporting"]},
            {"type": "Standard", "name": "Standard", "price": "₹1,02,000", "popular": True, "features": ["WhatsApp + Email integration", "Advanced analytics", "Automation workflows", "Multi-user system"]},
            {"type": "Premium", "name": "Premium", "price": "₹1,20,000+", "features": ["Full CRM system", "API integrations", "Custom workflows", "Advanced security"]}
        ]
    },
    {
        "id": "erp",
        "title": "ERP Development",
        "display": "none",
        "plans": [
            {"type": "Basic", "name": "Basic", "price": "₹1,50,000", "features": ["Inventory management", "Sales tracking", "Basic reports"]},
            {"type": "Standard", "name": "Standard", "price": "₹2,50,000", "popular": True, "features": ["HR + Finance modules", "Automation workflows", "Analytics dashboard"]},
            {"type": "Premium", "name": "Premium", "price": "₹4,00,000+", "features": ["Full ERP suite", "Custom modules", "API integrations", "Enterprise security"]}
        ]
    },
    {
        "id": "seo",
        "title": "SEO",
        "display": "none",
        "plans": [
            {"type": "Basic", "name": "Basic", "price": "₹6,000", "suffix": "/mo", "features": ["Keyword research", "1 blog/month", "15 backlinks", "Basic SEO"]},
            {"type": "Standard", "name": "Standard", "price": "₹12,000", "suffix": "/mo", "popular": True, "features": ["10 keywords", "2 blogs/month", "Technical SEO", "Rank tracking"]},
            {"type": "Premium", "name": "Premium", "price": "₹20,000", "suffix": "/mo", "features": ["20 keywords", "4 blogs/month", "Full SEO strategy", "Weekly reports"]}
        ]
    },
    {
        "id": "digital-marketing",
        "title": "Digital Marketing",
        "display": "none",
        "plans": [
            {"type": "Basic", "name": "Basic", "price": "₹25,000", "suffix": "/mo", "features": ["10 posts/month", "4 reels", "Content strategy", "Organic growth"]},
            {"type": "Standard", "name": "Standard", "price": "₹40,000", "suffix": "/mo", "popular": True, "features": ["14 posts", "8 reels", "Paid ads handling", "Branding support"]},
            {"type": "Premium", "name": "Premium", "price": "₹60,000", "suffix": "/mo", "features": ["16+ posts", "12 reels", "Full strategy", "Analytics + scaling"]}
        ]
    }
]

html_grid = '<div class="pricing-grid" id="pricingGrid">\n'
for cat in categories:
    html_grid += f'                    <!-- {cat["title"].upper()} -->\n'
    for plan in cat["plans"]:
        style_attr = '' if cat['display'] == 'flex' else ' style="display:none;"'
        popular_class = ' card-popular' if plan.get('popular') else ''
        suffix = plan.get('suffix', '')
        
        features_html = ""
        for feat in plan["features"]:
            features_html += f'                            <li><i class="fas fa-check"></i> {feat}</li>\n'
            
        btn_text = "Choose Plan" if plan.get('popular') else "Get Started"
        if plan['type'] == 'Premium': btn_text = "Contact Sales"
        
        html_grid += f"""                    <div class="pricing-card{popular_class}" data-category="{cat['id']}"{style_attr}>
                        <div class="card-type">{plan['type']}</div>
                        <h3 class="card-title">{plan['name']}</h3>
                        <div class="card-price">{plan['price']}<span>{suffix}</span></div>
                        <ul class="card-features">
{features_html}                        </ul>
                        <a href="contact.html" class="card-btn">{btn_text}</a>
                    </div>\n"""
                    
html_grid += '                </div>'

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Replace category-nav
        new_content = re.sub(
            r'<div class="category-nav">.*?</div>', 
            html_nav, 
            content, 
            flags=re.DOTALL
        )
        
        # Replace pricing-grid
        new_content = re.sub(
            r'<div class="pricing-grid" id="pricingGrid">.*?</div>', 
            html_grid, 
            new_content, 
            flags=re.DOTALL
        )
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")
    except Exception as e:
        print(f"Failed to update {filepath}: {e}")

process_file('pricing.html')
process_file('public/pricing.html')
