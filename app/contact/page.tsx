import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="max-w-4xl mx-auto px-8 py-12">
      <h2 className="text-3xl font-bold mb-4 text-gray-900">
        Contact Us
      </h2>
      <p className="text-lg text-gray-700 mb-8">
        Have questions, suggestions, or feedback about IGGY WIKI? We'd love to hear from you!
      </p>

      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Email
            </h3>
            <a
              href="mailto:iggywikiapp@gmail.com"
              className="text-blue-600 hover:text-blue-800 hover:underline text-lg"
            >
              iggywikiapp@gmail.com
            </a>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              About IGGY WIKI
            </h3>
            <p className="text-gray-700 leading-relaxed">
              IGGY WIKI is a resource for students, parents, and faculty to access information about
              St. Ignatius College Preparatory, including teacher directories, course catalogs, bell schedules,
              and weekly lunch menus.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
