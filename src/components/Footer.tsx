const Footer = () => {
  return (
    <footer className="py-12 border-t border-gray-800/50 bg-gray-950/50 backdrop-blur-xl relative">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <span className="text-white font-bold text-sm">IQ</span>
            </div>
            <span className="font-semibold text-white text-base">InterviewPrep</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-gray-400">
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Contact</a>
          </div>
          <p className="text-sm text-gray-500">
            © 2026 InterviewPrep
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
