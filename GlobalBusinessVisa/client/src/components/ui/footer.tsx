import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-auto py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {/* Company Information */}
          <div className="text-center sm:text-left order-3 sm:order-1 mt-6 sm:mt-0">
            <h3 className="text-primary font-semibold text-lg mb-2 md:mb-3">Global Business Pay</h3>
            <p className="text-slate-400 text-xs md:text-sm">Providing premium VISA cards for global business professionals and entrepreneurs.</p>
          </div>
          
          {/* Quick Links */}
          <div className="text-center order-1 sm:order-2">
            <h3 className="text-primary font-semibold text-lg mb-2 md:mb-3">Quick Links</h3>
            <ul className="flex flex-wrap justify-center sm:block sm:space-y-2">
              <li className="px-3 sm:px-0">
                <Link href="/">
                  <span className="text-slate-400 hover:text-primary text-sm">Home</span>
                </Link>
              </li>
              <li className="px-3 sm:px-0">
                <Link href="/cards">
                  <span className="text-slate-400 hover:text-primary text-sm">Cards</span>
                </Link>
              </li>
              <li className="px-3 sm:px-0">
                <Link href="/benefits">
                  <span className="text-slate-400 hover:text-primary text-sm">Benefits</span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Social Links */}
          <div className="text-center sm:text-right order-2 sm:order-3">
            <h3 className="text-primary font-semibold text-lg mb-2 md:mb-3">Connect With Us</h3>
            <div className="flex justify-center sm:justify-end space-x-5 md:space-x-4">
              <a href="#" className="text-slate-400 hover:text-primary transition-colors duration-200">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5 md:h-6 md:w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors duration-200">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5 md:h-6 md:w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors duration-200">
                <span className="sr-only">Telegram</span>
                <svg className="h-5 w-5 md:h-6 md:w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm2.692 14.889c.161.142.361.211.556.211.272 0 .54-.109.73-.312.395-.405.395-1.049 0-1.454l-2.302-2.334 2.302-2.334c.395-.405.395-1.049 0-1.454-.391-.405-1.024-.405-1.415 0l-3.01 3.061c-.395.405-.395 1.049 0 1.454l3.139 3.162zm-5.384-10.889h7.385c.569 0 1.028.459 1.028 1.025 0 .565-.459 1.025-1.028 1.025h-7.385c-.569 0-1.028-.459-1.028-1.025 0-.565.459-1.025 1.028-1.025z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-slate-800 mt-6 md:mt-8 pt-4 md:pt-6 text-center">
          <p className="text-slate-400 text-xs md:text-sm">© 2025 Global Business Pay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
